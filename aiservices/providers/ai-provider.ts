import type { ChatRole } from "../types/ai.types.js";

export type ProviderMessage = {
  role: ChatRole;
  content: string;
};

export type ProviderReply = {
  reply: string;
  confidence: number;
  shouldEscalate: boolean;
  ctaSuggestions: string[];
};

export interface AiProvider {
  generateReply(input: {
    systemPrompt: string;
    messages: ProviderMessage[];
    userMessage: string;
  }): Promise<ProviderReply>;
}