import { frontendEnv } from "./env";

const AI_SERVICE_URL = frontendEnv.NEXT_PUBLIC_AI_SERVICE_URL;

type AiMessagePayload = {
  message: string;
  conversationId?: string | null;
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
};

type AiLeadPayload = {
  conversationId?: string | null;
  name: string;
  email: string;
  phone: string;
  city: string;
  question: string;
};

export type AiChatResult = {
  conversationId: string;
  reply: string;
  confidence: number;
  shouldEscalate: boolean;
  ctaSuggestions: Array<"CALCULATOR" | "EMI_CALCULATOR" | "COMPARE_PANELS" | "GET_PROPOSAL">;
  suggestedQuestions: string[];
};

async function request<T>(path: string, payload: unknown): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const response = await fetch(`${AI_SERVICE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok || data.success === false) {
      return { success: false, error: data.error || "Request failed" };
    }

    return { success: true, data: data.data as T };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Network error" };
  }
}

export const aiChatClient = {
  async sendMessage(payload: AiMessagePayload) {
    const body: any = { ...payload };
    if (body.conversationId === null) delete body.conversationId;
    return request<AiChatResult>("/api/ai-chat/message", body);
  },

  async submitLead(payload: AiLeadPayload) {
    const body: any = { ...payload };
    if (body.conversationId === null) delete body.conversationId;
    return request<{ leadId: string; status: string; conversationId?: string }>("/api/ai-chat/lead", body);
  },

  async health() {
    try {
      const response = await fetch(`${AI_SERVICE_URL}/api/ai-chat/health`);
      const data = await response.json();
      return response.ok ? { success: true, data } : { success: false, error: data.error || "Health check failed" };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Network error" };
    }
  },
};