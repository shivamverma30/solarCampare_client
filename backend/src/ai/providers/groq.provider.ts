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

function buildRequestBody(systemPrompt: string, messages: ProviderMessage[]) {
  const conversation = messages
    .map((entry) => `${entry.role.toUpperCase()}: ${entry.content}`)
    .join("\n");

  return {
    model: getEnv().GROQ_MODEL || AI_DEFAULT_MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: [
          "Return only valid JSON with keys: reply, confidence, shouldEscalate, ctaSuggestions.",
          "confidence must be a number between 0 and 1.",
          "shouldEscalate must be true if the user is asking for pricing, a quotation, site survey, vendor-specific advice, or anything you cannot answer confidently.",
          `Allowed CTA suggestions are: ${AI_CTA_SUGGESTIONS.join(", ")}.`,
          "Keep the reply to 3-4 sentences max. Start with the direct answer, stay friendly, and avoid marketing text.",
          "Never include raw JSON in the reply field.",
          "Conversation history follows.",
          conversation,
        ].join("\n\n"),
      },
    ],
    temperature: 0.4,
    max_tokens: 260,
  };
}

function parseReply(rawText: string): ProviderReply {
  const jsonText = extractJsonObject(rawText);
  const fallbackReply = "I can help with solar sizing, savings, EMI, and panel comparisons. If you need a site-specific quote, share your details and I’ll connect you to an expert.";

  if (!jsonText) {
    return {
      reply: fallbackReply,
      confidence: 0,
      shouldEscalate: false,
      ctaSuggestions: [],
    };
  }

  try {
    const parsed = JSON.parse(jsonText) as Partial<ProviderReply>;
    const reply = limitSentences(String(parsed.reply || ""), 4);
    const confidence = typeof parsed.confidence === "number" ? parsed.confidence : 0;
    const shouldEscalate = Boolean(parsed.shouldEscalate);
    const ctaSuggestions = Array.isArray(parsed.ctaSuggestions) ? parsed.ctaSuggestions.map(String) : [];

    return {
      reply: reply || fallbackReply,
      confidence: Number.isFinite(confidence) ? Math.max(0, Math.min(1, confidence)) : 0,
      shouldEscalate,
      ctaSuggestions,
    };
  } catch {
    return {
      reply: fallbackReply,
      confidence: 0,
      shouldEscalate: false,
      ctaSuggestions: [],
    };
  }
}

class GroqProvider implements AiProvider {
  async generateReply(input: { systemPrompt: string; messages: ProviderMessage[]; userMessage: string }): Promise<ProviderReply> {
    const env = getEnv();
    const requestBody = buildRequestBody(input.systemPrompt, input.messages);

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
      throw new Error(`Groq request failed with status ${response.status}${errorText ? `: ${errorText}` : ""}`);
    }

    const data = (await response.json()) as GroqResponse;
    const text = data.choices?.[0]?.message?.content || "";
    const parsed = parseReply(text);

    if (isLikelySalesLead(input.userMessage)) {
      parsed.shouldEscalate = true;
      parsed.confidence = Math.min(parsed.confidence, 0.62);
      if (!parsed.ctaSuggestions.includes("GET_PROPOSAL")) {
        parsed.ctaSuggestions = [...parsed.ctaSuggestions, "GET_PROPOSAL"];
      }
    }

    if (!parsed.ctaSuggestions.length) {
      parsed.ctaSuggestions = ["CALCULATOR", "COMPARE_PANELS"];
    }

    return parsed;
  }
}

export const groqProvider = new GroqProvider();
