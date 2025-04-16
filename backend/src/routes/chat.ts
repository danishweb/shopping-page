import { Router, Request, Response, NextFunction } from "express";
import Item from "../models/Item";
import { successResponse, errorResponse } from "../utils/response";

const router = Router();

// Simple keyword-based chat query handler
import { IItem } from "../models/Item";

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== "string") {
      const { statusCode, body } = errorResponse("BAD_REQUEST", "Chat message is required", null, 400);
      return res.status(statusCode).json(body);
    }

    // Basic parsing for SKU or price queries
    let results: IItem[] = [];
    let query: Record<string, any> = {};

    // Find SKU (e.g., "Find SKU 12345")
    const skuMatch = message.match(/sku\s*([\w-]+)/i);
    if (skuMatch) {
      query = { "Variant SKU": { $regex: skuMatch[1], $options: "i" } };
      results = await Item.find(query).lean();
    } else if (/under \$?(\d+)/i.test(message)) {
      // Show items under a price (e.g., "Show electronics under $50")
      const priceMatch = message.match(/under \$?(\d+)/i);
      if (priceMatch) {
        const price = parseFloat(priceMatch[1]);
        query = { "Variant Price": { $lt: price } };
        // Optionally filter by type/category
        const typeMatch = message.match(/show ([\w\s]+) under/i);
        if (typeMatch) {
          query = {
            ...query,
            Type: { $regex: typeMatch[1].trim(), $options: "i" }
          };
        }
        results = await Item.find(query).lean();
      }
    } else {
      // Fallback: try searching by title
      query = { Title: { $regex: message, $options: "i" } };
      results = await Item.find(query).lean();
    }

    const { statusCode, body } = successResponse(results);
    res.status(statusCode).json(body);
  } catch (err) {
    next(err);
  }
});

export default router;
