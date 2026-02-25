// backend/routes/customProducts.js
const express = require('express');
const router = express.Router();
const CustomProduct = require('../models/CustomProduct');
const auth = require('../middleware/auth');

// GET
router.get('/', async (req, res) => {
  try {
    const items = await CustomProduct.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch custom products' });
  }
});

// POST
router.post('/', auth, async (req, res) => {
  try {
    const p = new CustomProduct(req.body);
    await p.save();
    res.json(p);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create custom product' });
  }
});

// PUT
router.put('/:id', auth, async (req, res) => {
  try {
    const p = await CustomProduct.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!p) return res.status(404).json({ message: 'Custom product not found' });
    res.json(p);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update custom product' });
  }
});

// DELETE
router.delete('/:id', auth, async (req, res) => {
  try {
    const p = await CustomProduct.findByIdAndDelete(req.params.id);
    if (!p) return res.status(404).json({ message: 'Custom product not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete custom product' });
  }
});

module.exports = router;