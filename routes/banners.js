// backend/routes/banners.js
const express = require('express');
const router = express.Router();
const HeroBanner = require('../models/HeroBanner');
const auth = require('../middleware/auth');

// GET
router.get('/', async (req, res) => {
  try {
    const banners = await HeroBanner.find().sort({ createdAt: -1 });
    res.json(banners);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch banners' });
  }
});

// POST
router.post('/', auth, async (req, res) => {
  try {
    const b = new HeroBanner(req.body);
    await b.save();
    res.json(b);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create banner' });
  }
});

// PUT
router.put('/:id', auth, async (req, res) => {
  try {
    const b = await HeroBanner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!b) return res.status(404).json({ message: 'Banner not found' });
    res.json(b);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update banner' });
  }
});

// DELETE
router.delete('/:id', auth, async (req, res) => {
  try {
    const b = await HeroBanner.findByIdAndDelete(req.params.id);
    if (!b) return res.status(404).json({ message: 'Banner not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete banner' });
  }
});

module.exports = router;