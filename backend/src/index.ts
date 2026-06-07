import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

// validate environment early
import {getEnv} from "./lib/env";
const env = getEnv();

const app = express();
const PORT = Number(env.PORT || process.env.PORT);

if (!PORT || Number.isNaN(PORT)) {
  throw new Error("Missing or invalid environment variable: PORT");
}

if (!env.FRONTEND_URL) {
  throw new Error("Missing required environment variable: FRONTEND_URL");
}

// Middleware
app.use(
  cors({
    origin: env.FRONTEND_URL,
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
import uploadRoutes from "./routes/upload";
import quoteRoutes from "./routes/quote";

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/calculators", calculatorRoutes);
app.use("/api/notifications", notificationRoutes);
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
  console.log(`🔗 Frontend URL: ${env.FRONTEND_URL}`);
  console.log(`📊 Database: ${process.env.DATABASE_URL?.substring(0, 40)}...`);
});
