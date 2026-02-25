// backend/routes/customOrders.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const CustomBookOrder = require('../models/CustomBookOrder');
const auth = require('../middleware/auth');

// Multer setup for order uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// GET all orders
router.get('/', auth, async (req, res) => {
  try {
    const orders = await CustomBookOrder.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch custom book orders' });
  }
});

// PUT update order (status, adminNotes etc)
router.put('/:id', auth, async (req, res) => {
  try {
    const order = await CustomBookOrder.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update order' });
  }
});

// Handle new custom photo book order with image uploads
router.post('/', upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'photos', maxCount: 50 }
]), async (req, res) => {
  try {
    const { customerName, customerPhone, pages, bookName, bookPrice, notes } = req.body;

    // Process uploaded files
    const coverImage = req.files['coverImage'] 
      ? '/uploads/' + req.files['coverImage'][0].filename 
      : '';
    
    const photos = req.files['photos'] 
      ? req.files['photos'].map(f => '/uploads/' + f.filename) 
      : [];

    const orderData = {
      customer: {
        name: customerName,
        phone: customerPhone,
      },
      book: {
        name: bookName,
        price: bookPrice,
      },
      coverImage,
      photos,
      status: 'Pending',
      adminNotes: notes || '',
    };

    const order = new CustomBookOrder(orderData);
    await order.save();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      orderId: order._id
    });
  } catch (err) {
    console.error('Order submission error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to submit order',
      error: err.message
    });
  }
});

module.exports = router;