import cloudinary from "cloudinary";
import multer from "multer";
import path from "path";
import fs from "fs";

// Cloudinary configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer storage for local uploads (optional)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join("uploads/");
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) cb(null, true);
  else cb(new Error("Only image files are allowed!"), false);
};

// Multer upload instance
export const upload = multer({ storage, fileFilter });

// Upload image to Cloudinary
export const uploadToCloudinary = async (filePath, folder = "products") => {
  try {
    const result = await cloudinary.v2.uploader.upload(filePath, { folder });
    return result.secure_url;
  } catch (err) {
    throw new Error(err.message);
  }
};
