// backend/models/special.js
import mongoose from "mongoose";

const specialOfferSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Offer title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    image: {
      type: String,
      required: [true, "Offer image URL is required"],
    },
    category: {
      type: String,
      default: "Exclusive",
      trim: true,
      enum: ["Exclusive", "Frames", "Albums", "Photo Books", "Bundles", "Clearance", "Other"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Optional: Index for faster queries on active offers and order
specialOfferSchema.index({ isActive: 1, displayOrder: 1 });

const SpecialOffer = mongoose.model("SpecialOffer", specialOfferSchema);

export default SpecialOffer;