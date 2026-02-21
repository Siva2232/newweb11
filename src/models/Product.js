import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    subcategory: { type: String },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    description: { type: String },
    detailedDescription: { type: String },
    specifications: [{ label: String, value: String }],
    image: { type: String },
    images: [String],
    stock: { type: Number, default: 0 },
    isTrending: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Indexes for faster filtering and sorting
productSchema.index({ category: 1 });
productSchema.index({ subcategory: 1 });
productSchema.index({ isTrending: 1 });
productSchema.index({ isBestSeller: 1 });
productSchema.index({ name: "text" }); // Text search optimized

const Product = mongoose.model("Product", productSchema);
export default Product;
