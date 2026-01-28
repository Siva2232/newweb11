import express from "express";
import {
  getHeroBanners,
  createHeroBanner,
  updateHeroBanner,
  deleteHeroBanner,
} from "../controllers/heroBanner.controller.js";
import { protectAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public route
router.get("/", getHeroBanners);

// Protected routes
router.post("/", protectAdmin, createHeroBanner);
router.put("/:id", protectAdmin, updateHeroBanner);
router.delete("/:id", protectAdmin, deleteHeroBanner);

export default router;
