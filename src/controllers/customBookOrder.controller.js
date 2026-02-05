// src/controllers/customBookOrder.controller.js
import CustomBookOrder from "../models/CustomBookOrder.js";
import CustomProduct from "../models/CustomProduct.js";

// Create new custom book order (public - customer)
export const createCustomBookOrder = async (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      pages,
      bookName,
      bookPrice,
      bookDescription,
      productName,
      productPrice,
      productTag,
      notes,
    } = req.body;

    // Handle uploaded files
    let coverImagePath = "";
    const photoPaths = [];

    if (req.files) {
      if (req.files.coverImage) {
        coverImagePath = `/uploads/${req.files.coverImage[0].filename}`;
      }
      if (req.files.photos) {
        photoPaths.push(
          ...req.files.photos.map((file) => `/uploads/${file.filename}`)
        );
      }
    }

    if (photoPaths.length === 0) {
      return res.status(400).json({ message: "At least one photo is required" });
    }

    const order = new CustomBookOrder({
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
      productReference: req.body.productId || null, // optional
      coverImage: coverImagePath,
      photos: photoPaths,
      notes: notes?.trim() || "",
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: "Custom book order submitted successfully",
      orderId: order._id,
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message || "Failed to create order" });
  }
};

// Get all orders (admin only)
export const getCustomBookOrders = async (req, res) => {
  try {
    const orders = await CustomBookOrder.find()
      .sort({ createdAt: -1 })
      .populate("productReference", "name price tag image");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single order (admin)
export const getCustomBookOrderById = async (req, res) => {
  try {
    const order = await CustomBookOrder.findById(req.params.id)
      .populate("productReference", "name price tag image");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order (admin) — e.g. status, notes
export const updateCustomBookOrder = async (req, res) => {
  try {
    const order = await CustomBookOrder.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Allow updating status, admin notes, etc.
    if (req.body.status) order.status = req.body.status;
    if (req.body.adminNotes !== undefined) order.adminNotes = req.body.adminNotes;

    await order.save();
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteCustomBookOrder = async (req, res) => {
  try {
    const order = await CustomBookOrder.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};