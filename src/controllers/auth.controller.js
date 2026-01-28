import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";
import env from "../config/env.js";

// Login
export const loginAdmin = async (req, res) => {
  const { email, username, password } = req.body;
  const loginField = email || username; // Accept either email or username

  try {
    const admin = await Admin.findOne({ username: loginField });
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign({ id: admin._id, username: admin.username }, env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token, admin: { id: admin._id, username: admin.username } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
