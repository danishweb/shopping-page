import { Router, Request, Response, NextFunction } from "express";
import Item from "../models/Item";
import { successResponse, errorResponse } from "../utils/response";

// In-memory cart (for demo, no user accounts)
let cart: string[] = [];

const router = Router();

// GET /api/cart - Get cart contents
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await Item.find({ "Variant SKU": { $in: cart } }).lean();
    const { statusCode, body } = successResponse(items);
    res.status(statusCode).json(body);
  } catch (err) {
    next(err);
  }
});

// POST /api/cart - Add item to cart { sku }
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sku } = req.body;
    if (!sku) {
      const { statusCode, body } = errorResponse("BAD_REQUEST", "SKU is required", null, 400);
      return res.status(statusCode).json(body);
    }
    if (!cart.includes(sku)) {
      const item = await Item.findOne({ "Variant SKU": sku });
      if (!item) {
        const { statusCode, body } = errorResponse("NOT_FOUND", `Item with SKU '${sku}' not found`, null, 404);
        return res.status(statusCode).json(body);
      }
      cart.push(sku);
    }
    const { statusCode, body } = successResponse({ cart });
    res.status(statusCode).json(body);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/cart/:sku - Remove item from cart
router.delete("/:sku", (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sku } = req.params;
    cart = cart.filter((itemSku) => itemSku !== sku);
    const { statusCode, body } = successResponse({ cart });
    res.status(statusCode).json(body);
  } catch (err) {
    next(err);
  }
});

export default router;
