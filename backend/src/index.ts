import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

// validate environment early
import {getEnv} from "./lib/env";
getEnv();

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
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
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL}`);
  console.log(`📊 Database: ${process.env.DATABASE_URL?.substring(0, 40)}...`);
});
