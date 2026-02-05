// src/models/CustomBookOrder.js
import mongoose from "mongoose";

const customBookOrderSchema = new mongoose.Schema(
  {
    customer: {
      name: {
        type: String,
        required: [true, "Customer name is required"],
        trim: true,
      },
      phone: {
        type: String,
        required: [true, "Phone number is required"],
        trim: true,
      },
    },

    book: {
      name: { type: String, required: true, trim: true },
      price: { type: String, required: true, trim: true }, // e.g. "₹5499" or "Custom Quote"
      description: { type: String, trim: true },
      pages: {
        type: Number,
        required: true,
        min: [20, "Minimum 20 pages required"],
      },
    },

    productReference: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CustomProduct",
      required: false, // optional — if ordered from a predefined product
    },

    coverImage: {
      type: String, // "/uploads/cover-xxx.jpg"
      default: "",
    },

    photos: [{
      type: String, // array of "/uploads/photo-xxx.jpg"
      required: [true, "At least one photo is required"],
    }],

    notes: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: ["Pending", "Processing", "In Production", "Ready", "Delivered", "Cancelled"],
      default: "Pending",
    },

    adminNotes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

const CustomBookOrder = mongoose.model("CustomBookOrder", customBookOrderSchema);
export default CustomBookOrder;