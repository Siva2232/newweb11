// backend/routes/upload.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// store uploads in /backend/uploads folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

// set per-file size limit 5MB
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// POST /api/upload  (single image)
router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  // return path that frontend can append to BASE_URL
  const urlPath = '/uploads/' + req.file.filename;
  res.json({ path: urlPath });
});

// handle multer file-size errors
router.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ message: 'File size exceeds 5MB limit' });
  }
  next(err);
});

module.exports = router;