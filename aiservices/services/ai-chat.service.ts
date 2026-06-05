import { getEnv } from "../config/env.js";
import { AI_CONFIDENCE_THRESHOLD } from "../constants/assistant.constants.js";
import type { AiChatResponse, AiLeadInput, AiLeadResponse, AiMessageInput, CtaSuggestion } from "../types/ai.types.js";
import { buildConversationSnippet, clampText, limitSentences, normalizeText } from "../utils/text.js";
import { query } from "../utils/db.js";
import { geminiProvider } from "../providers/gemini.provider.js";
import { createAdminNotification } from "./notification.service.js";
import { buildLeadNotificationTemplate } from "../templates/lead-notification.template.js";
import { SYSTEM_PROMPT } from "../prompts/system.prompt.js";

type ConversationRow = {
  id: string;
  original_question: string;
  conversation_snippet: string | null;
};

type ChatMessageRow = {
  role: string;
  message: string;
};

function createId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function sanitizeSuggestions(values: string[]): CtaSuggestion[] {
  const allowed: CtaSuggestion[] = ["CALCULATOR", "EMI_CALCULATOR", "COMPARE_PANELS", "GET_PROPOSAL"];
  return values.filter((value): value is CtaSuggestion => allowed.includes(value as CtaSuggestion));
}

async function getOrCreateConversation(input: AiMessageInput) {
  const requestedId = input.conversationId?.trim();
  if (requestedId) {
    const existing = await query<ConversationRow>(
      `SELECT id, original_question, conversation_snippet FROM ai_chat_conversations WHERE id = $1 LIMIT 1`,
      [requestedId]
    );

    if (existing.rows[0]) {
      return existing.rows[0];
    }
  }

  const conversationId = createId();
  const created = await query<ConversationRow>(
    `
      INSERT INTO ai_chat_conversations (
        id,
        name,
        email,
        phone,
        city,
        original_question,
        conversation_snippet,
        confidence,
        metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 0, $8::jsonb)
      RETURNING id, original_question, conversation_snippet
    `,
    [
      conversationId,
      input.name || null,
      input.email || null,
      input.phone || null,
      input.city || null,
      input.message,
      null,
      JSON.stringify({ source: "AI_CHAT_ASSISTANT" }),
    ]
  );

  return created.rows[0];
}

async function getOrCreateLeadConversation(input: AiLeadInput) {
  const requestedId = input.conversationId?.trim();
  if (requestedId) {
    const existing = await query<{ id: string }>(
      `SELECT id FROM ai_chat_conversations WHERE id = $1 LIMIT 1`,
      [requestedId]
    );

    if (existing.rows[0]) {
      return existing.rows[0].id;
    }
  }

  const created = await query<{ id: string }>(
    `
      INSERT INTO ai_chat_conversations (
        id,
        name,
        email,
        phone,
        city,
        original_question,
        conversation_snippet,
        confidence,
        metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 0, $8::jsonb)
      RETURNING id
    `,
    [
      createId(),
      input.name || null,
      input.email || null,
      input.phone || null,
      input.city || null,
      input.question,
      clampText(input.question),
      JSON.stringify({ source: "AI_CHAT_ASSISTANT", origin: "LEAD_CAPTURE" }),
    ]
  );

  return created.rows[0].id;
}

async function persistMessage(params: {
  conversationId: string;
  role: "user" | "assistant";
  message: string;
  confidence?: number;
}) {
  await query(
    `
      INSERT INTO ai_chat_messages (
        id,
        conversation_id,
        role,
        message,
        confidence,
        metadata
      ) VALUES ($1, $2, $3, $4, $5, $6::jsonb)
    `,
    [createId(), params.conversationId, params.role, params.message, params.confidence ?? null, JSON.stringify({})]
  );
}

async function loadRecentMessages(conversationId: string) {
  const result = await query<ChatMessageRow>(
    `
      SELECT role, message
      FROM ai_chat_messages
      WHERE conversation_id = $1
      ORDER BY created_at ASC
      LIMIT 12
    `,
    [conversationId]
  );

  return result.rows;
}

export const aiChatService = {
  async respondToMessage(input: AiMessageInput): Promise<AiChatResponse> {
    getEnv();
    const conversation = await getOrCreateConversation(input);
    const conversationId = conversation.id;
    const cleanMessage = clampText(normalizeText(input.message));

    await persistMessage({ conversationId, role: "user", message: cleanMessage });

    const recentMessages = await loadRecentMessages(conversationId);

    const providerReply = await geminiProvider.generateReply({
      systemPrompt: SYSTEM_PROMPT,
      messages: recentMessages.map((entry: ChatMessageRow) => ({
        role: entry.role === "assistant" ? "assistant" : "user",
        content: entry.message,
      })),
      userMessage: cleanMessage,
    });

    const shouldEscalate = providerReply.shouldEscalate || providerReply.confidence < AI_CONFIDENCE_THRESHOLD;
    const ctaSuggestions = sanitizeSuggestions(providerReply.ctaSuggestions);
    const shortReply = limitSentences(providerReply.reply, 4);

    await persistMessage({
      conversationId,
      role: "assistant",
      message: shortReply,
      confidence: providerReply.confidence,
    });

    await query(
      `
        UPDATE ai_chat_conversations
        SET
          conversation_snippet = $2,
          confidence = $3,
          status = $4,
          updated_at = NOW()
        WHERE id = $1
      `,
      [
        conversationId,
        buildConversationSnippet([
          ...recentMessages,
          { role: "user", message: cleanMessage },
          { role: "assistant", message: shortReply },
        ]),
        providerReply.confidence,
        shouldEscalate ? "NEEDS_EXPERT" : "ACTIVE",
      ]
    );

    return {
      conversationId,
      reply: shortReply,
      confidence: providerReply.confidence,
      shouldEscalate,
      ctaSuggestions: ctaSuggestions.length ? ctaSuggestions : ["CALCULATOR", "COMPARE_PANELS"],
      suggestedQuestions: [
        "How much roof space is needed for a 5kW solar plant?",
        "What subsidy is available for residential rooftop solar?",
        "Which solar panel brand gives better long-term ROI?",
        "Can I run AC and heavy appliances on solar?",
        "How much can I save with solar?",
      ],
    };
  },

  async captureLead(input: AiLeadInput): Promise<AiLeadResponse> {
    const conversationId = await getOrCreateLeadConversation(input);
    const leadId = createId();
    const snippetResult = conversationId
      ? await query<{ conversation_snippet: string | null }>(
          `SELECT conversation_snippet FROM ai_chat_conversations WHERE id = $1 LIMIT 1`,
          [conversationId]
        )
      : { rows: [] as { conversation_snippet: string | null }[] };

    const conversationSnippet = snippetResult.rows[0]?.conversation_snippet || null;
    const summary = conversationSnippet || clampText(input.question);
    const timestamp = new Date().toISOString();
    const leadNotification = buildLeadNotificationTemplate({
      name: input.name,
      email: input.email,
      phone: input.phone,
      city: input.city,
      question: input.question,
      summary,
      timestamp,
    });

    await query(
      `
        INSERT INTO ai_chat_leads (
          id,
          conversation_id,
          name,
          email,
          phone,
          city,
          question,
          conversation_snippet,
          source,
          status,
          metadata
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'AI_CHAT_ASSISTANT', 'NEW', $9::jsonb)
      `,
      [
        leadId,
        conversationId,
        input.name,
        input.email,
        input.phone,
        input.city,
        input.question,
        conversationSnippet,
        JSON.stringify({
          source: "AI_CHAT_ASSISTANT",
          model: getEnv().AI_MODEL,
          name: input.name,
          email: input.email,
          phone: input.phone,
          city: input.city,
          lastQuestion: input.question,
          chatSummary: summary,
          timestamp,
        }),
      ]
    );

    await query(`UPDATE ai_chat_conversations SET status = 'LEAD_CAPTURED', updated_at = NOW() WHERE id = $1`, [conversationId]);

    await createAdminNotification({
      title: leadNotification.title,
      body: leadNotification.body,
      type: leadNotification.type,
      priority: leadNotification.priority,
      metadata: {
        leadId,
        conversationId,
        source: "AI Chat Assistant",
        name: input.name,
        email: input.email,
        phone: input.phone,
        city: input.city,
        question: input.question,
        summary,
        timestamp,
      },
    });

    return {
      leadId,
      conversationId,
      status: "NEW",
    };
  },
};