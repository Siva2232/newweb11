// backend/routes/categories.js
const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const auth = require('../middleware/auth');

// GET all
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
});

// POST create
router.post('/', auth, async (req, res) => {
  try {
    const cat = new Category(req.body);
    await cat.save();
    res.json(cat);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create category' });
  }
});

// PUT update
router.put('/:id', auth, async (req, res) => {
  try {
    const cat = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!cat) return res.status(404).json({ message: 'Category not found' });
    res.json(cat);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update category' });
  }
});

// DELETE
router.delete('/:id', auth, async (req, res) => {
  try {
    const cat = await Category.findByIdAndDelete(req.params.id);
    if (!cat) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete category' });
  }
});

module.exports = router;
