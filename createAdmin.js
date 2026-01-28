import mongoose from "mongoose";
import env from "./src/config/env.js";
import Admin from "./src/models/Admin.js";

mongoose.connect(env.MONGO_URI)
  .then(async () => {
    // Delete existing admins first for fresh start
    await Admin.deleteMany({});
    
    const admin = new Admin({ username: "admin@gmail.com", password: "password123" });
    await admin.save();
    console.log("✅ Admin user created: admin@gmail.com / password123");
    process.exit();
  })
  .catch(console.error);
