export type CtaSuggestion =
  | "CALCULATOR"
  | "EMI_CALCULATOR"
  | "COMPARE_PANELS"
  | "GET_PROPOSAL";

export type ChatRole = "system" | "user" | "assistant";

export type AiMessageInput = {
  message: string;
  conversationId?: string;
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
};

export type AiLeadInput = {
  conversationId?: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  question: string;
};

export type AiChatResponse = {
  conversationId: string;
  reply: string;
  confidence: number;
  shouldEscalate: boolean;
  ctaSuggestions: CtaSuggestion[];
  suggestedQuestions: string[];
};

export type AiLeadResponse = {
  leadId: string;
  conversationId?: string;
  status: string;
};