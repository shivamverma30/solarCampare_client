import { Router, type Request, type Response } from "express";
import { aiChatService } from "../services/ai-chat.service";
import { messageSchema, leadSchema } from "../validators/ai.validators";
import { rateLimit } from "../middleware/rate-limit.middleware";

export const aiChatRouter = Router();

export const healthHandler = (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    status: "ok",
    service: "Solar AI Assistant",
  });
};

export const messageHandler = [
  rateLimit({ windowMs: 60_000, max: 24 }),
  async (req: Request, res: Response) => {
    const parsed = messageSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ success: false, error: parsed.error.issues[0]?.message || "Invalid message payload" });
      return;
    }

    try {
      const payload = parsed.data!;
      const result = await aiChatService.respondToMessage(payload);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("AI message error:", error);
      res.status(200).json({
        success: true,
        data: {
          reply: "Sorry, I couldn't process that request right now. Please try again.",
          confidence: 0,
          shouldEscalate: true,
          ctaSuggestions: ["GET_PROPOSAL"],
          suggestedQuestions: [],
          conversationId: parsed.data?.conversationId || "",
        },
      });
    }
  },
];

export const leadHandler = [
  rateLimit({ windowMs: 5 * 60_000, max: 8 }),
  async (req: Request, res: Response) => {
    const parsed = leadSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ success: false, error: parsed.error.issues[0]?.message || "Invalid lead payload" });
      return;
    }

    try {
      const payload = parsed.data!;
      const result = await aiChatService.captureLead(payload);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      console.error("AI lead error:", error);
      res.status(500).json({ success: false, error: "Unable to save lead right now" });
    }
  },
];

aiChatRouter.get("/ai-chat/health", healthHandler);
aiChatRouter.post("/ai-chat/message", messageHandler);
aiChatRouter.post("/ai-chat/lead", leadHandler);
