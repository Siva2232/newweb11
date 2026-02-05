// src/controllers/customOrder.controller.js
import CustomOrder from "../models/CustomOrder.js";
import CustomProduct from "../models/CustomProduct.js";

// ── Customer creates order (public) ────────────────────────────────
export const createCustomOrder = async (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      bookName,
      bookPrice,
      bookDescription,
      pages,
      notes,
      productId, // optional
    } = req.body;

    // Files from multer
    const photos = req.files?.photos || [];
    const cover = req.files?.cover ? req.files.cover[0] : null;

    if (photos.length === 0) {
      return res.status(400).json({ message: "At least one photo is required" });
    }

    // Build photo paths
    const photoPaths = photos.map((file) => `/uploads/${file.filename}`);

    const coverPath = cover ? `/uploads/${cover.filename}` : "";

    const orderData = {
      customer: {
        name: customerName.trim(),
        phone: customerPhone.trim(),
      },
      book: {
        name: bookName.trim(),
        price: bookPrice.trim(),
        description: bookDescription?.trim() || "",
        pages: Number(pages),
      },
      photos: photoPaths,
      coverImage: coverPath,
      notes: notes?.trim() || "",
    };

    // Link to product if provided
    if (productId) {
      const product = await CustomProduct.findById(productId);
      if (product) {
        orderData.product = product._id;
        // Optionally override book fields from product
        if (!bookName) orderData.book.name = product.name;
        if (!bookPrice) orderData.book.price = product.price;
      }
    }

    const order = new CustomOrder(orderData);
    await order.save();

    res.status(201).json({
      success: true,
      order,
      message: "Custom book order created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// ── Admin: Get all orders ──────────────────────────────────────────
export const getCustomOrders = async (req, res) => {
  try {
    const orders = await CustomOrder.find()
      .sort({ createdAt: -1 })
      .populate("product", "name price tag image");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Admin: Get single order ───────────────────────────────────────
export const getCustomOrderById = async (req, res) => {
  try {
    const order = await CustomOrder.findById(req.params.id).populate(
      "product",
      "name price tag image"
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Admin: Update order (e.g. status) ─────────────────────────────
export const updateCustomOrder = async (req, res) => {
  try {
    const order = await CustomOrder.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Allow status change + notes, etc.
    if (req.body.status) order.status = req.body.status;
    if (req.body.notes !== undefined) order.notes = req.body.notes;

    await order.save();
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ── Admin: Delete order ───────────────────────────────────────────
export const deleteCustomOrder = async (req, res) => {
  try {
    const order = await CustomOrder.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};