import express from "express";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
import { protectAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public route
router.get("/", getCategories);

// Protected routes (admin)
router.post("/", protectAdmin, createCategory);
router.put("/:id", protectAdmin, updateCategory);
router.delete("/:id", protectAdmin, deleteCategory);

export default router;
