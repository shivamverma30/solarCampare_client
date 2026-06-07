export type AiServiceEnv = {
  DATABASE_URL: string;
  GEMINI_API_KEY: string;
  AI_MODEL: string;
  PORT: number;
  NODE_ENV: string;
  FRONTEND_URL: string;
};

let cachedEnv: AiServiceEnv | null = null;

export function getEnv(): AiServiceEnv {
  if (cachedEnv) {
    return cachedEnv;
  }

  const NODE_ENV = process.env.NODE_ENV || "development";
  const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/solar_db";
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
  const AI_MODEL = process.env.AI_MODEL || "gemini-2.5-flash";
  const rawPort = process.env.PORT || "3002";
  const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
  const PORT = Number(rawPort);

  if (!rawPort || Number.isNaN(PORT)) {
    throw new Error("Missing or invalid environment variable: PORT");
  }

  if (NODE_ENV === "production") {
    if (!DATABASE_URL) {
      throw new Error("Missing required environment variable: DATABASE_URL");
    }

    if (!GEMINI_API_KEY) {
      throw new Error("Missing required environment variable: GEMINI_API_KEY");
    }
  }

  if (!DATABASE_URL) {
    throw new Error("Missing required environment variable: DATABASE_URL");
  }

  if (!GEMINI_API_KEY) {
    throw new Error("Missing required environment variable: GEMINI_API_KEY");
  }

  cachedEnv = { DATABASE_URL, GEMINI_API_KEY, AI_MODEL, PORT, NODE_ENV, FRONTEND_URL };
  return cachedEnv;
}