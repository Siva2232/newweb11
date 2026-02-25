// backend/server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');

const connectDB = require('./config/db');

// routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const subcategoryRoutes = require('./routes/subcategories');
const bannerRoutes = require('./routes/banners');
const specialOfferRoutes = require('./routes/specialOffers');
const customProductRoutes = require('./routes/customProducts');
const customOrderRoutes = require('./routes/customOrders');
const uploadRoutes = require('./routes/upload');
const errorHandler = require('./middleware/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 5001;

// connect to Mongo
connectDB();

console.log('Environment Debug:', {
  PORT: PORT,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL ? 'SET' : 'NOT SET',
  MONGO_URI: process.env.MONGO_URI ? 'SET' : 'NOT SET',
  JWT_SECRET: process.env.JWT_SECRET ? 'SET' : 'NOT SET',
});

// middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// mount routers
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/subcategories', subcategoryRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/special-offers', specialOfferRoutes);
app.use('/api/custom-products', customProductRoutes);
app.use('/api/custom-orders', customOrderRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/', (req, res) => {
  res.send('newwww backend is running');
});

// 404 handler
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// Error middleware
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  .on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Please check if another server is running.`);
      process.exit(1);
    } else {
      throw err;
    }
  });
