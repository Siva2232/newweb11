import express from "express";
import cors from "cors";
import morgan from "morgan";

import env from "../src/config/env.js";
import { errorHandler, notFound } from "./middlewares/error.middleware.js";

// Routes
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import heroBannerRoutes from "./routes/heroBanner.routes.js";

const app = express();

/* -------------------- MIDDLEWARES -------------------- */
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

/* -------------------- API ROUTES -------------------- */
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/hero-banners", heroBannerRoutes);

/* -------------------- HEALTH CHECK -------------------- */
app.get("/", (req, res) => {
  res.json({ message: "🚀 API is running" });
});

/* -------------------- ERROR HANDLER -------------------- */
app.use(errorHandler);

export default app;
