// src/models/CustomProduct.js
import mongoose from "mongoose";

const customProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    price: {
      type: String,
      required: [true, "Price is required"],
      trim: true, // e.g. "₹4,999"
    },
    shortDesc: {
      type: String,
      trim: true,
      default: "",
    },
    fullDesc: {
      type: String,
      trim: true,
      default: "",
    },
    tag: {
      type: String,
      enum: ["Signature", "Essential", "Gift", "Premium", "Limited"],
      default: "Signature",
    },
    image: {
      type: String, // URL after upload
      default: "",
    },
  },
  { timestamps: true }
);

const CustomProduct = mongoose.model("CustomProduct", customProductSchema);
export default CustomProduct;