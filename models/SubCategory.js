// backend/models/SubCategory.js
const mongoose = require('mongoose');

const SubCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true }, // could be ref to Category name or ID
    image: { type: String, default: '' },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SubCategory', SubCategorySchema);
