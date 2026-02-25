// backend/models/SpecialOffer.js
const mongoose = require('mongoose');

const SpecialOfferSchema = new mongoose.Schema(
  {
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    category: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SpecialOffer', SpecialOfferSchema);
