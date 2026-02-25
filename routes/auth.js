// backend/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const normalizedEmail = email.toLowerCase().trim();
    let user = await AdminUser.findOne({ email: normalizedEmail });

    // SUPER-ADMIN SYNC: If the login matches the current environment variables, 
    // update the database user to match. This ensures the .env file is always the 
    // "Master Key" even if the user already exists in the database.
    const envAdminEmail = (process.env.ADMIN_EMAIL || 'admin@example.com').toLowerCase().trim();
    const envAdminPass = process.env.ADMIN_PASSWORD || 'password123';

    if (normalizedEmail === envAdminEmail && password === envAdminPass) {
      console.log('Master Key detected. Syncing admin user in database...');
      const hashed = await bcrypt.hash(envAdminPass, 10);
      
      if (!user) {
        user = new AdminUser({ email: normalizedEmail, password: hashed });
        await user.save();
      } else {
        user.password = hashed;
        await user.save();
      }
      // Continue to token generation below
    }

    if (!user) {
      console.log(`Login failed: User not found for ${normalizedEmail}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`Login failed: Password mismatch for ${normalizedEmail}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '1d',
    });

    res.json({ token, email: user.email, id: user._id });
  } catch (err) {
    console.error('Auth Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
