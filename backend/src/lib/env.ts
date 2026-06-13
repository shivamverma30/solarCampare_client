type EnvConfig = {
  DATABASE_URL: string;
  PORT: string;
  NODE_ENV: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  FRONTEND_URL: string;
  GROQ_API_KEY: string;
  GROQ_MODEL: string;
  EMAIL_LOGO_URL?: string;
  SMTP_HOST?: string;
  SMTP_PORT?: string;
  SMTP_USER?: string;
  SMTP_PASS?: string;
  SMTP_SECURE?: string;
  EMAIL_FROM: string;
  ADMIN_EMAIL: string;
  ADMIN_PASSWORD?: string;
  CLOUDINARY_CLOUD_NAME?: string;
  CLOUDINARY_API_KEY?: string;
  CLOUDINARY_API_SECRET?: string;
};

export function getEnv(): EnvConfig {
  const NODE_ENV = process.env.NODE_ENV || "development";

  const cfg: EnvConfig = {
    DATABASE_URL: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/solar_db",
    PORT: process.env.PORT || "3001",
    NODE_ENV,
    JWT_SECRET: process.env.JWT_SECRET || "dev-only-jwt-secret-change-in-production",
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
    FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
    GROQ_API_KEY: process.env.GROQ_API_KEY || "",
    GROQ_MODEL: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
    EMAIL_LOGO_URL: process.env.EMAIL_LOGO_URL,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    SMTP_SECURE: process.env.SMTP_SECURE,
    EMAIL_FROM: process.env.EMAIL_FROM || process.env.SMTP_FROM || "no-reply@localhost",
    ADMIN_EMAIL: process.env.ADMIN_EMAIL || "admin@localhost",
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  };

  // Strict validation in production while keeping development bootstrapping easy.
  const requiredInProd = ["DATABASE_URL", "JWT_SECRET", "FRONTEND_URL", "GROQ_API_KEY", "EMAIL_FROM", "ADMIN_EMAIL"];
  if (cfg.NODE_ENV === "production") {
    for (const key of requiredInProd) {
      if (!(cfg as any)[key]) {
        throw new Error(`Missing required environment variable: ${key}`);
      }
    }
    if (!cfg.SMTP_HOST || !cfg.SMTP_USER || !cfg.SMTP_PASS) {
      throw new Error("Missing SMTP configuration in production (SMTP_HOST/SMTP_USER/SMTP_PASS)");
    }
  }

  return cfg;
}
