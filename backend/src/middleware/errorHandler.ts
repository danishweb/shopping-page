import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../utils/response";

// Centralized error handler middleware
export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const status = err.statusCode || 500;
  const code = err.code || "INTERNAL_SERVER_ERROR";
  const message = err.message || "An unexpected error occurred.";
  const details = err.details;

  const { statusCode, body } = errorResponse(code, message, details, status);
  res.status(statusCode).json(body);
}
