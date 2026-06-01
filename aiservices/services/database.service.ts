import { query } from "../utils/db.js";

export async function initializeDatabase(): Promise<void> {
  await query(`
    CREATE TABLE IF NOT EXISTS ai_chat_conversations (
      id TEXT PRIMARY KEY,
      source TEXT NOT NULL DEFAULT 'solar-ai-assistant',
      status TEXT NOT NULL DEFAULT 'ACTIVE',
      name TEXT,
      email TEXT,
      phone TEXT,
      city TEXT,
      original_question TEXT NOT NULL,
      conversation_snippet TEXT,
      confidence NUMERIC(4,3) NOT NULL DEFAULT 0,
      metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS ai_chat_conversations_created_at_idx ON ai_chat_conversations (created_at DESC);
    CREATE INDEX IF NOT EXISTS ai_chat_conversations_status_idx ON ai_chat_conversations (status);

    CREATE TABLE IF NOT EXISTS ai_chat_messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL REFERENCES ai_chat_conversations(id) ON DELETE CASCADE,
      role TEXT NOT NULL,
      message TEXT NOT NULL,
      confidence NUMERIC(4,3),
      metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS ai_chat_messages_conversation_id_idx ON ai_chat_messages (conversation_id, created_at ASC);

    CREATE TABLE IF NOT EXISTS ai_chat_leads (
      id TEXT PRIMARY KEY,
      conversation_id TEXT REFERENCES ai_chat_conversations(id) ON DELETE SET NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      city TEXT NOT NULL,
      question TEXT NOT NULL,
      conversation_snippet TEXT,
      source TEXT NOT NULL DEFAULT 'AI_CHAT_ASSISTANT',
      status TEXT NOT NULL DEFAULT 'NEW',
      metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS ai_chat_leads_created_at_idx ON ai_chat_leads (created_at DESC);
    CREATE INDEX IF NOT EXISTS ai_chat_leads_status_idx ON ai_chat_leads (status);
  `);
}