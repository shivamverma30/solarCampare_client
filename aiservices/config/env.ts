export type AiServiceEnv = {
  DATABASE_URL: string;
  GEMINI_API_KEY: string;
  AI_MODEL: string;
  PORT: number;
  FRONTEND_URL: string;
};

let cachedEnv: AiServiceEnv | null = null;

export function getEnv(): AiServiceEnv {
  if (cachedEnv) {
    return cachedEnv;
  }

  const DATABASE_URL = process.env.DATABASE_URL || "";
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
  const AI_MODEL = process.env.AI_MODEL || "gemini-2.5-flash";
  const PORT = Number(process.env.PORT || "4000");
  const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

  if (!DATABASE_URL) {
    throw new Error("Missing required environment variable: DATABASE_URL");
  }

  if (!GEMINI_API_KEY) {
    throw new Error("Missing required environment variable: GEMINI_API_KEY");
  }

  cachedEnv = { DATABASE_URL, GEMINI_API_KEY, AI_MODEL, PORT, FRONTEND_URL };
  return cachedEnv;
}