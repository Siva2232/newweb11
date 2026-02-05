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

const app = express();

/* -------------------- 🔥 CORS (MUST BE FIRST) -------------------- */
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
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
const projectRoot = process.cwd();
app.use("/uploads", express.static(path.join(projectRoot, "uploads")));

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
