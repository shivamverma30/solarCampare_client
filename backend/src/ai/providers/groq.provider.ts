import { getEnv } from "../../lib/env";
import { AI_CTA_SUGGESTIONS, AI_DEFAULT_MODEL } from "../constants/assistant.constants";
import { extractJsonObject, isLikelySalesLead, limitSentences } from "../utils/text";
import type { AiProvider, ProviderMessage, ProviderReply } from "./ai-provider";

type GroqResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

/**
 * Detect simple greetings so we can avoid injecting tool suggestions for them.
 */
function isGreeting(message: string): boolean {
  const normalized = message.toLowerCase().trim();
  return /^(hi+|hello+|hey+|howdy|namaste|good\s*(morning|afternoon|evening|day)|how are you|how r u|what'?s up|sup|greetings)[\s!?.]*$/.test(normalized);
}

function buildRequestBody(systemPrompt: string, messages: ProviderMessage[], userMessage: string) {
  // Build conversation history as separate chat messages (not concatenated into one string).
  // This keeps role context clear for the model and avoids prompt confusion.
  const historyMessages = messages.slice(-10).map((entry) => ({
    role: entry.role as "user" | "assistant",
    content: entry.content,
  }));

  const outputInstruction = [
    "Respond with ONLY a valid JSON object — no markdown fences, no extra text.",
    "Required keys:",
    '  "reply"         : string  — your actual response to the user (plain text, no JSON)',
    '  "confidence"    : number  — between 0.0 and 1.0',
    '  "shouldEscalate": boolean — true only if user explicitly asks for a quote, site visit, or vendor contact',
    `  "ctaSuggestions": array   — zero or more of: ${AI_CTA_SUGGESTIONS.join(", ")}`,
    "Only include ctaSuggestions that are directly relevant to this specific question.",
    "For greetings or conversational messages, ctaSuggestions must be an empty array [].",
    "Keep reply to 2–3 sentences, max 80 words. Answer the question directly first.",
  ].join("\n");

  return {
    model: getEnv().GROQ_MODEL || AI_DEFAULT_MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "system", content: outputInstruction },
      ...historyMessages,
      { role: "user", content: userMessage },
    ],
    temperature: 0.35,
    max_tokens: 280,
  };
}

function parseReply(rawText: string, userMessage: string): ProviderReply {
  // Context-aware fallback: greetings get a natural reply; others get a useful solar fallback.
  const fallbackReply = isGreeting(userMessage)
    ? "Hello! 👋 How can I help you with solar panels, savings estimates, subsidies, or vendor comparisons today?"
    : "I can help with solar sizing, savings, subsidies, and EMI options. Could you share a bit more detail about what you'd like to know?";

  const jsonText = extractJsonObject(rawText);

  if (!jsonText) {
    return {
      reply: fallbackReply,
      confidence: isGreeting(userMessage) ? 0.9 : 0.5,
      shouldEscalate: false,
      ctaSuggestions: [],
    };
  }

  try {
    const parsed = JSON.parse(jsonText) as Partial<ProviderReply>;
    const reply = limitSentences(String(parsed.reply || "").trim(), 4);
    const confidence = typeof parsed.confidence === "number" ? parsed.confidence : 0.5;
    const shouldEscalate = Boolean(parsed.shouldEscalate);
    const ctaSuggestions = Array.isArray(parsed.ctaSuggestions)
      ? parsed.ctaSuggestions.map(String)
      : [];

    return {
      reply: reply || fallbackReply,
      confidence: Number.isFinite(confidence) ? Math.max(0, Math.min(1, confidence)) : 0.5,
      shouldEscalate,
      ctaSuggestions,
    };
  } catch {
    return {
      reply: fallbackReply,
      confidence: isGreeting(userMessage) ? 0.9 : 0.5,
      shouldEscalate: false,
      ctaSuggestions: [],
    };
  }
}

class GroqProvider implements AiProvider {
  async generateReply(input: {
    systemPrompt: string;
    messages: ProviderMessage[];
    userMessage: string;
  }): Promise<ProviderReply> {
    const env = getEnv();
    const requestBody = buildRequestBody(input.systemPrompt, input.messages, input.userMessage);

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.GROQ_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      throw new Error(
        `Groq request failed with status ${response.status}${errorText ? `: ${errorText}` : ""}`
      );
    }

    const data = (await response.json()) as GroqResponse;
    const text = data.choices?.[0]?.message?.content ?? "";
    const parsed = parseReply(text, input.userMessage);

    // Only mark as sales lead for genuine quote/vendor requests — not generic solar questions.
    // Removed "rooftop", "price", "cost", "business" from the check — those are normal queries.
    if (isLikelySalesLead(input.userMessage)) {
      parsed.shouldEscalate = true;
      parsed.confidence = Math.min(parsed.confidence, 0.62);
      if (!parsed.ctaSuggestions.includes("GET_PROPOSAL")) {
        parsed.ctaSuggestions = [...parsed.ctaSuggestions, "GET_PROPOSAL"];
      }
    }

    return parsed;
  }
}

export const groqProvider = new GroqProvider();
