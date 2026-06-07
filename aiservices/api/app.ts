import express from "express";
import cors from "cors";
import { getEnv } from "../config/env.js";
import { apiRouter } from "./router.js";

export function createApp() {
  const env = getEnv();
  const app = express();
  const normalizeOrigin = (value: string) => value.replace(/\/$/, "");
  const allowedOrigins = new Set([
    "http://localhost:3000",
    normalizeOrigin(env.FRONTEND_URL),
  ]);

  app.use(
    cors({
      origin: (requestOrigin, callback) => {
        if (!requestOrigin) {
          callback(null, true);
          return;
        }

        const normalizedRequestOrigin = normalizeOrigin(requestOrigin);
        if (allowedOrigins.has(normalizedRequestOrigin)) {
          callback(null, true);
          return;
        }

        callback(new Error("Not allowed by CORS"));
      },
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