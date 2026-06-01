import express from "express";
import cors from "cors";
import { getEnv } from "../config/env.js";
import { apiRouter } from "./router.js";

export function createApp() {
  const env = getEnv();
  const app = express();

  app.use(
    cors({
      origin: env.FRONTEND_URL,
      credentials: true,
    })
  );
  app.use(express.json({ limit: "32kb" }));

  app.use("/api", apiRouter);

  app.use((req, res) => {
    res.status(404).json({ success: false, error: "Route not found" });
  });

  return app;
}