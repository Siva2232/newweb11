// backend/routes/subcategories.js
const express = require('express');
const router = express.Router();
const SubCategory = require('../models/SubCategory');
const auth = require('../middleware/auth');

// GET all
router.get('/', async (req, res) => {
  try {
    const subs = await SubCategory.find().sort({ name: 1 });
    res.json(subs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch subcategories' });
  }
});

// POST create
router.post('/', auth, async (req, res) => {
  try {
    const sub = new SubCategory(req.body);
    await sub.save();
    res.json(sub);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create subcategory' });
  }
});

// PUT update
router.put('/:id', auth, async (req, res) => {
  try {
    const sub = await SubCategory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!sub) return res.status(404).json({ message: 'Subcategory not found' });
    res.json(sub);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update subcategory' });
  }
});

// DELETE
router.delete('/:id', auth, async (req, res) => {
  try {
    const sub = await SubCategory.findByIdAndDelete(req.params.id);
    if (!sub) return res.status(404).json({ message: 'Subcategory not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete subcategory' });
  }
});

module.exports = router;
