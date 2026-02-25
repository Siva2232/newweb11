// backend/models/Product.js
const mongoose = require('mongoose');

const specificationSchema = new mongoose.Schema({
  label: { type: String },
  value: { type: String },
});

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, default: 0 },
    originalPrice: { type: Number, default: null },
    category: { type: String, default: 'uncategorized' },
    subcategory: { type: String, default: '' },
    description: { type: String, default: '' },
    detailedDescription: { type: String, default: '' },
    specifications: [specificationSchema],
    image: { type: String, default: '' },
    images: [{ type: String }],
    isTrending: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', ProductSchema);
