// src/controllers/customProduct.controller.js
import CustomProduct from "../models/CustomProduct.js";

// Get all custom products (public - for frontend ProductSelection)
export const getCustomProducts = async (req, res) => {
  try {
    const products = await CustomProduct.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new custom product (admin)
export const createCustomProduct = async (req, res) => {
  try {
    const { name, price, originalPrice, shortDesc, fullDesc, tag, image } = req.body;

    const product = new CustomProduct({
      name,
      price,
      originalPrice,
      shortDesc: shortDesc || "",
      fullDesc: fullDesc || "",
      tag: tag || "Signature",
      image: image || "",
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update custom product (admin)
export const updateCustomProduct = async (req, res) => {
  try {
    const product = await CustomProduct.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.name = req.body.name || product.name;
    product.price = req.body.price || product.price;
    product.originalPrice = req.body.originalPrice !== undefined ? req.body.originalPrice : product.originalPrice;
    product.shortDesc = req.body.shortDesc !== undefined ? req.body.shortDesc : product.shortDesc;
    product.fullDesc = req.body.fullDesc !== undefined ? req.body.fullDesc : product.fullDesc;
    product.tag = req.body.tag || product.tag;
    product.image = req.body.image || product.image;

    await product.save();
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete custom product (admin)
export const deleteCustomProduct = async (req, res) => {
  try {
    const product = await CustomProduct.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Custom product removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};