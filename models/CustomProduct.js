// backend/models/CustomProduct.js
const mongoose = require('mongoose');

const CustomProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, default: 0 },
    originalPrice: { type: Number, default: 0 },
    shortDesc: { type: String, default: '' },
    fullDesc: { type: String, default: '' },
    tag: { type: String, default: 'Signature' },
    image: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CustomProduct', CustomProductSchema);
