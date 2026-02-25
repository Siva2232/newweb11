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
    let user = await AdminUser.findOne({ email });

    // if no user in db, optionally create using environment var credentials
    if (!user && process.env.ADMIN_EMAIL === email) {
      const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD || '', 10);
      user = new AdminUser({ email, password: hashed });
      await user.save();
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '1d',
    });

    res.json({ token, email: user.email, id: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
