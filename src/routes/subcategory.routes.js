import express from "express";
import {
  getSubCategories,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
} from "../controllers/subcategory.controller.js";
import { protectAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public
router.get("/", getSubCategories);

// Admin only
router.post("/", protectAdmin, createSubCategory);
router.put("/:id", protectAdmin, updateSubCategory);
router.delete("/:id", protectAdmin, deleteSubCategory);

export default router;
