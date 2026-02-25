// backend/routes/products.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// GET /api/products/search
router.get('/search', async (req, res) => {
  try {
    const term = req.query.q;
    if (!term) return res.json([]);
    
    // Simple regex search (case-insensitive)
    const products = await Product.find({
      name: { $regex: term, $options: 'i' }
    }).limit(10);
    
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Search failed' });
  }
});

// GET /api/products  (public)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.category) query.category = req.query.category;
    if (req.query.isTrending === 'true') query.isTrending = true;
    if (req.query.isBestSeller === 'true') query.isBestSeller = true;

    const [products, total] = await Promise.all([
      Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Product.countDocuments(query)
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
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

// POST /api/products  (admin)
router.post('/', auth, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create product' });
  }
});

// PUT /api/products/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update product' });
  }
});

// DELETE /api/products/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete product' });
  }
});

// PATCH /api/products/:id/toggle-trending
router.patch('/:id/toggle-trending', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    product.isTrending = !product.isTrending;
    await product.save();
    res.json({ _id: product._id, isTrending: product.isTrending });
  } catch (err) {
    res.status(500).json({ message: 'Failed to toggle trending' });
  }
});

// PATCH /api/products/:id/toggle-best-seller
router.patch('/:id/toggle-best-seller', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    product.isBestSeller = !product.isBestSeller;
    await product.save();
    res.json({ _id: product._id, isBestSeller: product.isBestSeller });
  } catch (err) {
    res.status(500).json({ message: 'Failed to toggle best seller' });
  }
});

module.exports = router;
