import express from "express";
import {
  getSpecialOffers,
  createSpecialOffer,
  updateSpecialOffer,
  deleteSpecialOffer,
} from "../controllers/special.controller.js";

const router = express.Router();

// GET /api/special-offers
router.get("/", getSpecialOffers);

// POST /api/special-offers
router.post("/", createSpecialOffer);

// PUT /api/special-offers/:id
router.put("/:id", updateSpecialOffer);

// DELETE /api/special-offers/:id
router.delete("/:id", deleteSpecialOffer);

export default router;