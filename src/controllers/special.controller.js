// backend/controllers/special.js
import SpecialOffer from "../models/special.js";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Helper to save base64 image and return URL
// No longer needed: saveBase64Image
// Get all special offers
export const getSpecialOffers = async (req, res) => {
  try {
    const offers = await SpecialOffer.find().sort({ createdAt: -1 });
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create special offer
export const createSpecialOffer = async (req, res) => {
  const { title, description, image, category } = req.body;
  try {
    if (!image) throw new Error("Offer image is required");
    // Accept base64 image directly in 'image' field
    const offer = new SpecialOffer({
      title,
      description,
      image,
      category: category || "Exclusive",
    });
    await offer.save();
    res.status(201).json(offer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update special offer
export const updateSpecialOffer = async (req, res) => {
  try {
    const offer = await SpecialOffer.findById(req.params.id);
    if (!offer) return res.status(404).json({ message: "Offer not found" });

    offer.title = req.body.title || offer.title;
    offer.description = req.body.description || offer.description;
    offer.image = req.body.image || offer.image;
    offer.category = req.body.category || offer.category;

    await offer.save();
    res.json(offer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete special offer
export const deleteSpecialOffer = async (req, res) => {
  try {
    const offer = await SpecialOffer.findByIdAndDelete(req.params.id);
    if (!offer) return res.status(404).json({ message: "Offer not found" });

    res.json({ message: "Offer removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};