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
      const { statusCode, body } = errorResponse(
        "BAD_REQUEST",
        "Chat message is required",
        null,
        400
      );
      return res.status(statusCode).json(body);
    }

    // Build normalized type mapping for this request
    function normalizeType(str: string): string {
      return str
        .toLowerCase()
        .replace(/[^a-z0-9]+/gi, " ")
        .replace(/\s+/g, " ")
        .trim();
    }
    const typeMap: Record<string, string> = {};
    const types = await Item.distinct("Type");
    types.forEach((t) => {
      if (typeof t === "string") typeMap[normalizeType(t)] = t;
    });

    let results: IItem[] = [];
    let query: Record<string, any> = {};

    const normalized = message.toLowerCase().trim();

    // Find SKU (e.g., "Find SKU 12345")
    const skuMatch = normalized.match(/sku\s*([\w-]+)/i);
    if (skuMatch) {
      query = { "Variant SKU": { $regex: skuMatch[1], $options: "i" } };
      results = await Item.find(query).lean();
    } else {
      // Price filters
      let priceQuery: Record<string, any> = {};
      let type: string | null = null;

      // Less than (under, below, less than, cheaper than)
      const lessMatch = normalized.match(
        /(?:under|below|less than|cheaper than)\s*\$?\s*([\d]+(\.\d+)?)/i
      );
      if (lessMatch) priceQuery["$lt"] = parseFloat(lessMatch[1]);

      // Greater than (over, above, greater than, more than)
      const moreMatch = normalized.match(
        /(?:over|above|greater than|more than)\s*\$?\s*([\d]+(\.\d+)?)/i
      );
      if (moreMatch) priceQuery["$gt"] = parseFloat(moreMatch[1]);

      // "Between" queries (e.g., "between $10 and $30")
      const betweenMatch = normalized.match(
        /between\s*\$?([\d]+(\.\d+)?)\s*(and|to|-)\s*\$?([\d]+(\.\d+)?)/i
      );
      if (betweenMatch) {
        priceQuery["$gte"] = parseFloat(betweenMatch[1]);
        priceQuery["$lte"] = parseFloat(betweenMatch[4]);
      }

      // Extract type/category (ignore generic words)
      const typeMatch = normalized.match(
        /show(?:\s+\w+){0,2}\s+([\w\s]+?)\s+(under|below|less than|cheaper than|over|above|greater than|more than|between)/i
      );
      if (typeMatch) {
        const extractedType = typeMatch[1].trim().toLowerCase();
        if (
          !["product", "products", "item", "items", "me"].includes(
            extractedType
          )
        ) {
          // Try to map to DB type
          if (typeMap[extractedType]) {
            type = typeMap[extractedType];
          } else {
            type = extractedType; // fallback to regex
          }
        }
      }

      // Build query
      if (Object.keys(priceQuery).length > 0) {
        query["Variant Price"] = priceQuery;
        if (type) {
          // Use exact match if mapped, else fallback to regex
          if (typeMap[type]) {
            query["Type"] = type;
          } else {
            query["Type"] = { $regex: type, $options: "i" };
          }
        }
        results = await Item.find(query).lean();
      } else {
        // Fallback: title search
        query = { Title: { $regex: message, $options: "i" } };
        results = await Item.find(query).lean();
      }
    }

    const { statusCode, body } = successResponse(results);
    res.status(statusCode).json(body);
  } catch (err) {
    next(err);
  }
});

export default router;
