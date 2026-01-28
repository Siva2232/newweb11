import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleTrending,
  toggleBestSeller,
} from "../controllers/product.controller.js";
import { protectAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getProducts);
router.get("/:id", getProductById);

// Protected routes (admin only)
router.post("/", protectAdmin, createProduct);
router.put("/:id", protectAdmin, updateProduct);
router.delete("/:id", protectAdmin, deleteProduct);

// Featured toggles
router.patch("/:id/trending", protectAdmin, toggleTrending);
router.patch("/:id/best-seller", protectAdmin, toggleBestSeller);

export default router;
