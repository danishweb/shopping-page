import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { successResponse } from "./utils/response";
import { errorHandler } from "./middleware/errorHandler";
import { connectDB } from "./db/connect";

// Routes
import itemsRouter from "./routes/items";

const app = express();
const PORT = process.env.PORT || 4000;

// Connect to MongoDB
connectDB();

// CORS setup
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:3000").split(",").map(o => o.trim());
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());

import cartRouter from "./routes/cart";
app.use("/api/items", itemsRouter);
import chatRouter from "./routes/chat";
app.use("/api/cart", cartRouter);
app.use("/api/chat", chatRouter);

app.get("/", (req: Request, res: Response) => {
  const { statusCode, body } = successResponse({
    message: "Express backend is running!",
  });
  res.status(statusCode).json(body);
});

// Example error route for demonstration
app.get("/error", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error("This is a sample error!");
  // Optionally add properties for industry-standard error structure
  // @ts-ignore
  err.statusCode = 400;
  // @ts-ignore
  err.code = "BAD_REQUEST";
  next(err);
});

// Centralized error handler (should be last middleware)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Global error handlers
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  // Optionally, log to a file or external service
  // Exit process after logging
  process.exit(1);
});

process.on("unhandledRejection", (reason: any) => {
  console.error("Unhandled Rejection:", reason);
  // Optionally, log to a file or external service
  // Exit process after logging
  process.exit(1);
});
