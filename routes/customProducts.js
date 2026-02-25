// backend/routes/customProducts.js
const express = require('express');
const router = express.Router();
const CustomProduct = require('../models/CustomProduct');
const auth = require('../middleware/auth');

// GET
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      CustomProduct.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      CustomProduct.countDocuments()
    ]);

    res.json({
      products,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
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