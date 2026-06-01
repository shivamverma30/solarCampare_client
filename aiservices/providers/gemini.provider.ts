import { getEnv } from "../config/env.js";
import { AI_CTA_SUGGESTIONS, AI_DEFAULT_MODEL } from "../constants/assistant.constants.js";
import { extractJsonObject, isLikelySalesLead, normalizeText } from "../utils/text.js";
import type { AiProvider, ProviderMessage, ProviderReply } from "./ai-provider.js";

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
};

function buildRequestBody(systemPrompt: string, messages: ProviderMessage[]) {
  const conversation = messages
    .map((entry) => `${entry.role.toUpperCase()}: ${entry.content}`)
    .join("\n");

  return {
    systemInstruction: {
      parts: [{ text: systemPrompt }],
    },
    contents: [
      {
        role: "user",
        parts: [
          {
            text: [
              "Return only valid JSON with keys: reply, confidence, shouldEscalate, ctaSuggestions.",
              "confidence must be a number between 0 and 1.",
              "shouldEscalate must be true if the user is asking for pricing, a quotation, site survey, vendor-specific advice, or anything you cannot answer confidently.",
              `Allowed CTA suggestions are: ${AI_CTA_SUGGESTIONS.join(", ")}.`,
              "Keep reply to 2-5 sentences. Stay concise, consultant-like, and solar focused.",
              "Conversation history follows.",
              conversation,
            ].join("\n\n"),
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.4,
      topP: 0.9,
      maxOutputTokens: 260,
      responseMimeType: "application/json",
    },
  };
}

function parseReply(rawText: string): ProviderReply {
  const jsonText = extractJsonObject(rawText);
  const fallbackReply = normalizeText(rawText) || "I can help with solar sizing, savings, EMI, and panel comparisons. If you need a site-specific quote, share your details and I’ll connect you to an expert.";

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
    const reply = normalizeText(String(parsed.reply || ""));
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

class GeminiProvider implements AiProvider {
  async generateReply(input: { systemPrompt: string; messages: ProviderMessage[]; userMessage: string }): Promise<ProviderReply> {
    const env = getEnv();
    const model = env.AI_MODEL || AI_DEFAULT_MODEL;
    const requestBody = buildRequestBody(input.systemPrompt, input.messages);

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Gemini request failed with status ${response.status}`);
    }

    const data = (await response.json()) as GeminiResponse;
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
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

export const geminiProvider = new GeminiProvider();