const isProduction = process.env.NODE_ENV === "production";

function getClientEnv(name: string, developmentDefault: string): string {
  const value = process.env[name];
  if (value) {
    return value;
  }

  if (!isProduction) {
    return developmentDefault;
  }

  throw new Error(`Missing required environment variable: ${name}`);
}

export const frontendEnv = {
  NEXT_PUBLIC_API_URL: getClientEnv("NEXT_PUBLIC_API_URL", "http://localhost:3001/api"),
  NEXT_PUBLIC_AI_SERVICE_URL: getClientEnv("NEXT_PUBLIC_AI_SERVICE_URL", "http://localhost:3002"),
};
