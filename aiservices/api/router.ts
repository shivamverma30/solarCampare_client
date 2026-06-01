import { Router } from "express";
import { healthHandler, leadHandler, messageHandler } from "./routes/ai-chat.routes.js";

export const apiRouter = Router();

apiRouter.get("/ai-chat/health", healthHandler);
apiRouter.post("/ai-chat/message", messageHandler);
apiRouter.post("/ai-chat/lead", leadHandler);