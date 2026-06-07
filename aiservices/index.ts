import "dotenv/config";
import { createApp } from "./api/app.js";
import { getEnv } from "./config/env.js";
import { initializeDatabase } from "./services/database.service.js";

async function main() {
  const env = getEnv();

  await initializeDatabase();

  const app = createApp();

  app.listen(env.PORT, () => {
    console.log(`✅ Solar AI Assistant running on port ${env.PORT}`);
    console.log(`🔗 Frontend URL: ${env.FRONTEND_URL}`);
    console.log(`🤖 Model: ${env.AI_MODEL}`);
  });
}

main().catch((error) => {
  console.error("Failed to start Solar AI Assistant:", error);
  process.exit(1);
});