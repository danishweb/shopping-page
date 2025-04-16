import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { successResponse } from "./utils/response";
import { errorHandler } from "./middleware/errorHandler";
import { connectDB } from "./db/connect";

// Routes
import itemsRouter from "./routes/items";
import cartRouter from "./routes/cart";
import chatRouter from "./routes/chat";

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 4000;

// Connect to MongoDB
connectDB();

// CORS setup
const defaultAllowedOrigins = [
  "http://localhost:3000",
  "https://karini-ai.vercel.app",
  "https://karini-ai-frontend.vercel.app"
];

const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? [...defaultAllowedOrigins, ...process.env.ALLOWED_ORIGINS.split(",").map(o => o.trim())]
  : defaultAllowedOrigins;

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());

// API Routes
app.use("/api/items", itemsRouter);
app.use("/api/cart", cartRouter);
app.use("/api/chat", chatRouter);

// Root route
app.get("/", (req: Request, res: Response) => {
  const { statusCode, body } = successResponse({
    message: "Express backend is running!",
    env: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
  res.status(statusCode).json(body);
});

// Centralized error handler (should be last middleware)
app.use(errorHandler);

// Only start the server if we're not in a serverless environment
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Global error handlers
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
});

process.on("unhandledRejection", (reason: any) => {
  console.error("Unhandled Rejection:", reason);
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
});

// Export the Express app for Vercel serverless deployment
export default app;
