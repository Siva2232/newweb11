// src/routes/customBookOrder.routes.js
import express from "express";
import {
  createCustomBookOrder,
  getCustomBookOrders,
  getCustomBookOrderById,
  updateCustomBookOrder,
  deleteCustomBookOrder,
} from "../controllers/customBookOrder.controller.js";

import { upload } from "../middlewares/multer.js";
import { protectAdmin } from "../middlewares/auth.middleware.js";


const router = express.Router();

// Public – customer submits order
router.post(
  "/",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "photos", maxCount: 50 }, // adjust max as needed
  ]),
  createCustomBookOrder
);

// Admin only
router.get("/", protectAdmin, getCustomBookOrders);
router.get("/:id", protectAdmin, getCustomBookOrderById);
router.put("/:id", protectAdmin, updateCustomBookOrder);
router.delete("/:id", protectAdmin, deleteCustomBookOrder);

export default router;