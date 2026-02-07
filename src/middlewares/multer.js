import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* -------------------- ENSURE UPLOAD FOLDER EXISTS -------------------- */
// Resolve path relative to this file to ensure consistency regardless of CWD
const uploadDir = path.resolve(__dirname, "../../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/* -------------------- STORAGE -------------------- */
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = file.originalname
      .replace(ext, "")
      .toLowerCase()
      .replace(/\s+/g, "-");

    cb(null, `${name}-${Date.now()}${ext}`);
  },
});

/* -------------------- FILE FILTER -------------------- */
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};


/* -------------------- MULTER INSTANCES -------------------- */
export const uploadSingleImage = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
}).single("image");

// Generic multer instance for .fields, .array, etc.
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});
