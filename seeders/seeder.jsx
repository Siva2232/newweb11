/**
 * Admin credentials seeder
 * Run from newweb11 folder: npm run seed:admin
 *
 * Creates or updates the admin user from .env:
 *   ADMIN_EMAIL
 *   ADMIN_PASSWORD
 */
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const AdminUser = require("../models/AdminUser");

const seedAdmin = async () => {
  const email = (process.env.ADMIN_EMAIL || "admin@ppdo.com").toLowerCase().trim();
  const plainPassword = process.env.ADMIN_PASSWORD || "password123";
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error("❌ MONGO_URI is missing in .env");
    process.exit(1);
  }

  if (!email || !plainPassword) {
    console.error("❌ ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env");
    process.exit(1);
  }

  console.log("🔌 Connecting to MongoDB...");
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const hashedPassword = await bcrypt.hash(plainPassword, 10);
  const existing = await AdminUser.findOne({ email });

  if (existing) {
    existing.password = hashedPassword;
    await existing.save();
    console.log("✅ Admin user updated");
  } else {
    await AdminUser.create({ email, password: hashedPassword });
    console.log("✅ Admin user created");
  }

  console.log("──────────────────────────────");
  console.log("   Email:    ", email);
  console.log("   Password: ", plainPassword, "(from .env — change in production)");
  console.log("──────────────────────────────");
  console.log("You can now log in at the admin login page.");

  await mongoose.disconnect();
  console.log("🔌 Disconnected");
};

seedAdmin()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  });
