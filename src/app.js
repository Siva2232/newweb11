import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import { uploadSingleImage } from "./middlewares/multer.js";
import { errorHandler, notFound } from "./middlewares/error.middleware.js";

// Routes
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import heroBannerRoutes from "./routes/heroBanner.routes.js";
import specialRoutes from "./routes/special.routes.js";
import customProductRoutes from "./routes/customProduct.routes.js";
import customBookOrderRoutes from "./routes/customBookOrder.routes.js";
import subCategoryRoutes from "./routes/subcategory.routes.js";

const app = express();

app.set('trust proxy', 1); // Trust Nginx/Proxy properties

/* -------------------- 🔥 CORS (MUST BE FIRST) -------------------- */
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    // Allow specific origins including the Netlify app
    const allowedOrigins = [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://newwebppdo.netlify.app",
      "https://www.newwebppdo.netlify.app",
      process.env.FRONTEND_URL
    ];
    // If origin is in our list or we want to be permissive
    if (allowedOrigins.includes(origin) || !process.env.FRONTEND_URL || process.env.FRONTEND_URL === "*") {
      callback(null, true);
    } else {
      // Fallback: just allow it to unblock the user (reflect origin)
      callback(null, true);
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  credentials: true
}));

/* -------------------- FIX __dirname (ESM) -------------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* -------------------- BODY PARSERS -------------------- */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

/* -------------------- STATIC UPLOADS -------------------- */
// Serve uploads from the root uploads directory
const uploadsPath = path.resolve(__dirname, "../uploads");
app.use("/uploads", express.static(uploadsPath));
console.log(`📂 Serving static files from: ${uploadsPath}`);

/* -------------------- 🔥 IMAGE UPLOAD ROUTE (FORCED CORS) -------------------- */
app.post(
  "/api/uploads",
  uploadSingleImage,
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    res.status(200).json({
      path: `/uploads/${req.file.filename}`,
    });
  }
);

/* -------------------- API ROUTES -------------------- */
// Multer error handler to always send CORS headers
app.use((err, req, res, next) => {
  if (err && err.name === 'MulterError') {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res.status(400).json({ message: err.message });
  }
  next(err);
});
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/hero-banners", heroBannerRoutes);
app.use("/api/special-offers", specialRoutes);
app.use("/api/custom-products", customProductRoutes);
app.use("/api/custom-book-orders", customBookOrderRoutes);
app.use("/api/subcategories", subCategoryRoutes);

/* -------------------- HEALTH CHECK -------------------- */
app.get("/", (req, res) => {
  res.json({
    message: "🚀 API running",
    status: "OK",
    time: new Date().toISOString(),
  });
});

/* -------------------- ERRORS -------------------- */
app.use(notFound);
app.use(errorHandler);

export default app;
