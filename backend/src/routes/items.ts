import { Router, Request, Response, NextFunction } from "express";
import Item from "../models/Item";
import { successResponse, errorResponse } from "../utils/response";

const router = Router();

// GET /api/items?search=term
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search } = req.query;
    let query = {};

    if (typeof search === "string" && search.trim() !== "") {
      query = { $text: { $search: search } };
    }

    const items = await Item.find(query).lean();
    // Only include items with all required fields
    const REQUIRED_FIELDS = [
      "Image Src",
      "Title",
      "Variant SKU",
      "Variant Price",
    ];
    const filtered = items.filter((item) =>
      REQUIRED_FIELDS.every(
        (field) =>
          item[field as keyof typeof item] !== undefined &&
          item[field as keyof typeof item] !== null &&
          item[field as keyof typeof item] !== ""
      )
    );
    const { statusCode, body } = successResponse(filtered);
    res.status(statusCode).json(body);
  } catch (err) {
    next(err);
  }
});

export default router;
