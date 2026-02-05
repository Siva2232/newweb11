// src/routes/customProduct.routes.js
import express from "express";
import {
  getCustomProducts,
  createCustomProduct,
  updateCustomProduct,
  deleteCustomProduct,
} from "../controllers/customProduct.controller.js";
import { protectAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public (for frontend)
router.get("/", getCustomProducts);

// Admin only
router.post("/", protectAdmin, createCustomProduct);
router.put("/:id", protectAdmin, updateCustomProduct);
router.delete("/:id", protectAdmin, deleteCustomProduct);

export default router;