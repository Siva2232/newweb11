// backend/models/HeroBanner.js
const mongoose = require('mongoose');

const HeroBannerSchema = new mongoose.Schema(
  {
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('HeroBanner', HeroBannerSchema);
