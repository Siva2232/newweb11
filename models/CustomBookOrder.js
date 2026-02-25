// backend/models/CustomBookOrder.js
const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
});

const BookSchema = new mongoose.Schema({
  name: String,
  price: Number,
  specifications: mongoose.Schema.Types.Mixed,
});

const CustomBookOrderSchema = new mongoose.Schema(
  {
    customer: CustomerSchema,
    book: BookSchema,
    coverImage: String,
    photos: [String],
    status: { type: String, default: 'Pending' },
    adminNotes: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CustomBookOrder', CustomBookOrderSchema);
