import dotenv from "dotenv";

dotenv.config();

const env = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  NODE_ENV: process.env.NODE_ENV || "development",
};

// Fail fast if required env vars are missing
if (!env.MONGO_URI) throw new Error("❌ MONGO_URI is missing in .env file");
if (!env.JWT_SECRET) throw new Error("❌ JWT_SECRET is missing in .env file");

export default env;
