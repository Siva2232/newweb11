// backend/routes/specialOffers.js
const express = require('express');
const router = express.Router();
const SpecialOffer = require('../models/SpecialOffer');
const auth = require('../middleware/auth');

// GET
router.get('/', async (req, res) => {
  try {
    const offers = await SpecialOffer.find().sort({ createdAt: -1 });
    res.json(offers);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch special offers' });
  }
});

// POST
router.post('/', auth, async (req, res) => {
  try {
    const o = new SpecialOffer(req.body);
    await o.save();
    res.json(o);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create special offer' });
  }
});

// PUT
router.put('/:id', auth, async (req, res) => {
  try {
    const o = await SpecialOffer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!o) return res.status(404).json({ message: 'Offer not found' });
    res.json(o);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update special offer' });
  }
});

// DELETE
router.delete('/:id', auth, async (req, res) => {
  try {
    const o = await SpecialOffer.findByIdAndDelete(req.params.id);
    if (!o) return res.status(404).json({ message: 'Offer not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete special offer' });
  }
});

module.exports = router;