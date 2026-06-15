import { AI_CHAT_MAX_LENGTH, AI_LEAD_SNIPPET_LENGTH } from "../constants/assistant.constants";

export function normalizeText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function limitSentences(value: string, maxSentences = 4): string {
  const sentences = normalizeText(value)
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean);

  if (!sentences.length) {
    return normalizeText(value);
  }

  return sentences.slice(0, maxSentences).join(" ");
}

export function clampText(value: string, maxLength = AI_CHAT_MAX_LENGTH): string {
  return value.slice(0, maxLength);
}

export function buildConversationSnippet(messages: Array<{ role: string; message: string }>) {
  const combined = messages
    .slice(-6)
    .map((entry) => `${entry.role.toUpperCase()}: ${entry.message}`)
    .join("\n");

  return clampText(combined, AI_LEAD_SNIPPET_LENGTH);
}

export function extractJsonObject(text: string): string | null {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```json\s*([\s\S]*?)```/i);

  if (fenced?.[1]) {
    return fenced[1].trim();
  }

  const directObject = trimmed.match(/\{[\s\S]*\}/);
  return directObject?.[0]?.trim() || null;
}

export function isLikelySalesLead(message: string): boolean {
  // Only flag messages that are genuine requests for a quote, vendor contact,
  // or site-specific service — not general informational solar questions.
  const normalized = message.toLowerCase();
  return [
    "quotation",
    "get a quote",
    "send me a quote",
    "site survey",
    "site visit",
    "call me",
    "contact me",
    "book installation",
    "schedule installation",
    "assign vendor",
    "connect me to",
    "get proposal",
    "request proposal",
  ].some((keyword) => normalized.includes(keyword));
}
