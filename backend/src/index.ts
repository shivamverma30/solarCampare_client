import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

// validate environment early
import {getEnv} from "./lib/env";
const env = getEnv();

const app = express();
const PORT = Number(env.PORT);

if (!PORT || Number.isNaN(PORT)) {
  throw new Error("Missing or invalid environment variable: PORT");
}

const normalizeOrigin = (value: string) => value.replace(/\/$/, "");
const configuredFrontendOrigins = env.FRONTEND_URL
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean)
  .map(normalizeOrigin);
const allowedOrigins = new Set([
  "http://localhost:3000",
  ...configuredFrontendOrigins,
]);

// Middleware
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Routes
import authRoutes from "./routes/auth";
import productRoutes from "./routes/product";
import vendorRoutes from "./routes/vendor";
import leadRoutes from "./routes/lead";
import dashboardRoutes from "./routes/dashboard";
import calculatorRoutes from "./routes/calculator";
import notificationRoutes from "./routes/notification";
import referralRoutes from "./routes/referral";
import uploadRoutes from "./routes/upload";
import quoteRoutes from "./routes/quote";

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/calculators", calculatorRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/referrals", referralRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/quotes", quoteRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Backend is running" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🔗 Frontend URL(s): ${Array.from(allowedOrigins).join(", ")}`);
  console.log(`📊 Database: ${process.env.DATABASE_URL?.substring(0, 40)}...`);
});
