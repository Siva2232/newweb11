// backend/models/AdminUser.js
const mongoose = require('mongoose');

const AdminUserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true }, // hashed
  },
  { timestamps: true }
);

module.exports = mongoose.model('AdminUser', AdminUserSchema);
