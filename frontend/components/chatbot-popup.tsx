"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { chatbotQuestions } from "@/data/site";
import { useLocale } from "@/components/locale-provider";
import { aiChatClient, type AiChatResult } from "@/lib/ai-chat";

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
  createdAt: number;
};

const assistantIntro = [
  "👋 Hi, I'm Solar AI Assistant",
  "I can help with:",
  "• Solar sizing",
  "• Savings estimates",
  "• Subsidy guidance",
  "• Panel comparisons",
  "• EMI guidance",
].join("\n");

function createMessage(role: ChatMessage["role"], text: string): ChatMessage {
  return {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    text,
    createdAt: Date.now(),
  };
}

function formatTime(value: number): string {
  return new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function sanitizeReply(text: string): string {
  const trimmed = text.trim();

  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    try {
      const parsed = JSON.parse(trimmed) as { reply?: unknown };
      if (typeof parsed.reply === "string" && parsed.reply.trim()) {
        return parsed.reply.trim();
      }
    } catch {
      return "I can help with solar sizing, savings, subsidies, and vendor selection. Ask me anything about your solar plan.";
    }
  }

  return trimmed || "I can help with solar sizing, savings, subsidies, and vendor selection. Ask me anything about your solar plan.";
}

export default function ChatbotPopup() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [assistantState, setAssistantState] = useState<AiChatResult | null>(null);
  const [leadForm, setLeadForm] = useState({ name: "", email: "", phone: "", city: "" });
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadSuccess, setLeadSuccess] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { t } = useLocale();

  useEffect(() => {
    if (!open) {
      return;
    }

    const savedConversationId = window.localStorage.getItem("solar-ai-conversation-id");
    if (savedConversationId) {
      setConversationId(savedConversationId);
    }

    if (messages.length === 0) {
      setMessages([createMessage("assistant", assistantIntro)]);
    }

    inputRef.current?.focus();
  }, [open, messages.length]);

  useEffect(() => {
    if (!scrollRef.current) {
      return;
    }

    const target = scrollRef.current;
    requestAnimationFrame(() => {
      target.scrollTop = target.scrollHeight;
    });
  }, [messages, assistantState, isSending]);

  const suggestedQuestions = useMemo(() => assistantState?.suggestedQuestions || chatbotQuestions, [assistantState]);
  const hasUserMessages = useMemo(() => messages.some((message) => message.role === "user"), [messages]);
  const showQuickActions = !hasUserMessages;

  const sendMessage = async (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || isSending) {
      return;
    }

    setError("");
    setLeadSuccess("");
    setIsSending(true);
    setMessages((current) => [...current, createMessage("user", trimmed)]);

    const response = await aiChatClient.sendMessage({
      message: trimmed,
      conversationId,
    });

    if (!response.success || !response.data) {
      setMessages((current) => [
        ...current,
        createMessage("assistant", "Sorry, I couldn't process that request right now. Please try again."),
      ]);
      setError(response.error || "Unable to reach Solar AI Assistant right now.");
      setIsSending(false);
      return;
    }

    const data = response.data;
    setConversationId(data.conversationId);
    window.localStorage.setItem("solar-ai-conversation-id", data.conversationId);
    setMessages((current) => [...current, createMessage("assistant", sanitizeReply(data.reply))]);
    setAssistantState(data);
    setIsSending(false);
  };

  const handleLeadSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!assistantState || leadSubmitting) {
      return;
    }

    setLeadSubmitting(true);
    setError("");

    const question = messages
      .slice()
      .reverse()
      .find((message) => message.role === "user")?.text || assistantState.reply;

    const response = await aiChatClient.submitLead({
      conversationId,
      question,
      ...leadForm,
    });

    if (response.success) {
      setLeadSuccess("Thanks. Our solar expert will contact you shortly.");
      setAssistantState(null);
      setLeadForm({ name: "", email: "", phone: "", city: "" });
    } else {
      setError(response.error || "Unable to submit your details right now.");
    }

    setLeadSubmitting(false);
  };

  return (
    <div className="fixed bottom-22 right-4 z-50 flex flex-col items-end gap-3 sm:bottom-24 sm:right-6">
      {open ? (
        <div
          aria-hidden={!open}
          className="pointer-events-auto h-[min(78vh,660px)] w-[min(430px,calc(100vw-1rem))] overflow-hidden rounded-3xl border border-emerald-200/50 bg-white/95 shadow-[0_20px_50px_rgba(2,40,25,0.2)] ring-1 ring-white/70 backdrop-blur-xl transition-all duration-300 ease-out sm:h-[min(76vh,640px)] translate-y-0 scale-100 opacity-100"
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-slate-200/80 bg-linear-to-r from-emerald-50/80 via-white to-white px-4 py-3.5 sm:px-5">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600/12 text-emerald-700 ring-1 ring-emerald-500/20">
                  <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4 fill-current">
                    <path d="M4 4h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
                  </svg>
                </div>
                <p className="truncate text-sm font-semibold text-slate-900">{t("chatbot.title")}</p>
                <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  AI
                </span>
              </div>
              <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>Online</span>
                <span className="text-slate-300">•</span>
                <span>Ready to help</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t("chatbot.close")}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
            >
              <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4 fill-current">
                <path d="M18.3 5.71a1 1 0 0 0-1.42 0L12 10.59 7.12 5.7A1 1 0 0 0 5.7 7.12L10.59 12 5.7 16.88a1 1 0 0 0 1.42 1.42L12 13.41l4.88 4.89a1 1 0 0 0 1.42-1.42L13.41 12l4.89-4.88a1 1 0 0 0 0-1.41z" />
              </svg>
            </button>
          </div>

          <div className="flex min-h-0 flex-1 flex-col bg-linear-to-b from-white to-slate-50/40">
            <div
              ref={scrollRef}
              role="log"
              aria-live="polite"
              aria-label="Solar AI conversation"
              className="min-h-0 flex-1 space-y-4 overflow-y-auto px-3 py-3 sm:px-4"
            >
              {messages.map((message, index) => {
                const isAssistant = message.role === "assistant";
                const isIntro = index === 0 && isAssistant;

                return (
                  <div key={message.id} className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}>
                    <div className={`max-w-[92%] ${isAssistant ? "mr-6" : "ml-6"}`}>
                      {isAssistant ? (
                        <div className="mb-1 flex items-center gap-2 pl-1 text-[11px] text-slate-500">
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-700 ring-1 ring-emerald-500/20">
                            <svg viewBox="0 0 24 24" aria-hidden className="h-3 w-3 fill-current">
                              <path d="M4 4h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
                            </svg>
                          </span>
                          <span className="font-medium text-slate-600">Solar AI Assistant</span>
                          <span className="text-slate-300">•</span>
                          <span>{formatTime(message.createdAt)}</span>
                        </div>
                      ) : (
                        <div className="mb-1 text-right pr-1 text-[11px] text-slate-500">You • {formatTime(message.createdAt)}</div>
                      )}

                      <div
                        className={`rounded-2xl border px-3.5 py-2.5 text-[13px] leading-6 shadow-sm sm:text-sm ${
                          isAssistant
                            ? isIntro
                              ? "border-emerald-200/70 bg-emerald-50/70 text-slate-700"
                              : "border-slate-200 bg-white text-slate-700"
                            : "border-emerald-200 bg-emerald-100/85 text-emerald-950"
                        }`}
                      >
                        <p className="whitespace-pre-line">{message.text}</p>
                      </div>
                    </div>
                  </div>
                );
              })}

              {showQuickActions ? (
                <section className="space-y-2 rounded-2xl border border-slate-200/90 bg-white/90 p-3 shadow-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Suggested Questions</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedQuestions.map((question) => (
                      <button
                        key={question}
                        type="button"
                        onClick={() => void sendMessage(question)}
                        className="inline-flex max-w-full items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-left text-xs font-medium leading-5 text-slate-700 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30"
                      >
                        <span className="line-clamp-1">{question}</span>
                      </button>
                    ))}
                  </div>
                </section>
              ) : null}

              {isSending ? (
                <div className="flex justify-start">
                  <div className="max-w-[92%] mr-6 rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 shadow-sm">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-medium text-slate-600">Solar AI Assistant is typing</span>
                      <span className="inline-flex items-center gap-1" aria-hidden>
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500 [animation-delay:120ms]" />
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500 [animation-delay:220ms]" />
                      </span>
                    </div>
                  </div>
                </div>
              ) : null}

              {assistantState?.shouldEscalate ? (
                <form onSubmit={handleLeadSubmit} className="space-y-3 rounded-2xl border border-amber-200 bg-amber-50/75 p-3 sm:p-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Need expert assistance?</p>
                    <p className="mt-1 text-xs leading-5 text-slate-600">
                      Please share your details and our solar expert will contact you.
                    </p>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2">
                    <input
                      value={leadForm.name}
                      onChange={(event) => setLeadForm((current) => ({ ...current, name: event.target.value }))}
                      placeholder="Name"
                      autoComplete="name"
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-500/20"
                    />
                    <input
                      value={leadForm.email}
                      onChange={(event) => setLeadForm((current) => ({ ...current, email: event.target.value }))}
                      placeholder="Email"
                      type="email"
                      autoComplete="email"
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-500/20"
                    />
                    <input
                      value={leadForm.phone}
                      onChange={(event) => setLeadForm((current) => ({ ...current, phone: event.target.value }))}
                      placeholder="Phone Number"
                      autoComplete="tel"
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-500/20"
                    />
                    <input
                      value={leadForm.city}
                      onChange={(event) => setLeadForm((current) => ({ ...current, city: event.target.value }))}
                      placeholder="City"
                      autoComplete="address-level2"
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={leadSubmitting}
                    className="inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500/40 disabled:opacity-60"
                  >
                    {leadSubmitting ? "Submitting..." : "Submit"}
                  </button>
                </form>
              ) : null}

              {leadSuccess ? (
                <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800">
                  {leadSuccess}
                </p>
              ) : null}

              {error ? (
                <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
                  {error}
                </p>
              ) : null}
            </div>

            <div className="border-t border-slate-200/80 bg-white/95 px-3 py-3 sm:px-4">
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-2 py-2 shadow-[0_8px_24px_rgba(15,23,42,0.07)]">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      void sendMessage(input);
                      setInput("");
                    }
                  }}
                  placeholder="Ask a custom solar question"
                  className="min-w-0 flex-1 bg-transparent px-2 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => {
                    void sendMessage(input);
                    setInput("");
                  }}
                  disabled={isSending}
                  aria-label="Send message"
                  className="inline-flex h-9 items-center justify-center rounded-full bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 disabled:opacity-60"
                >
                  {isSending ? "..." : "Send"}
                </button>
              </div>
            </div>
            </div>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={t("chatbot.toggleLabel")}
        aria-expanded={open}
        className="pointer-events-auto inline-flex h-14 items-center gap-2 rounded-full border border-emerald-300/30 bg-[#1f8f4d]/40 px-4 text-sm font-semibold tracking-wide text-white backdrop-blur-xl shadow-[0_14px_34px_rgba(10,80,46,0.42)] ring-1 ring-white/20 transition duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-[#1f8f4d]/52 hover:shadow-[0_18px_42px_rgba(10,80,46,0.52)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
      >
        <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5 fill-current">
          <path d="M4 4h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
        </svg>
        <span>{t("chatbot.button")}</span>
      </button>
    </div>
  );
}
