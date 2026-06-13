const isProduction = process.env.NODE_ENV === "production";

function getClientEnv(value: string | undefined, name: string, developmentDefault: string): string {
  if (value && value.trim().length > 0) {
    return value;
  }

  if (!isProduction) {
    return developmentDefault;
  }

  throw new Error(`Missing required environment variable: ${name}`);
}

export const frontendEnv = {
  NEXT_PUBLIC_API_URL: getClientEnv(
    process.env.NEXT_PUBLIC_API_URL,
    "NEXT_PUBLIC_API_URL",
    "http://localhost:3001/api"
  ),
};
