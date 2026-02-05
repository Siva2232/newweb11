// // routes/custom.routes.js
// import express from "express";
// import {
//   getCustomOrders,
//   getCustomOrderById,
//   createCustomOrder,
//   updateCustomOrder,
//   deleteCustomOrder,
//   updateOrderStatus,          // optional - if you want a dedicated status-only endpoint
// } from "../controllers/custom.controller.js";

// import { protectAdmin } from "../middlewares/auth.middleware.js";

// const router = express.Router();

// // Public route – customer can submit order
// router.post("/", createCustomOrder);

// // Protected routes (admin only)
// router.get("/", protectAdmin, getCustomOrders);              // list all orders
// router.get("/:id", protectAdmin, getCustomOrderById);        // get single order
// router.put("/:id", protectAdmin, updateCustomOrder);         // full update
// router.patch("/:id/status", protectAdmin, updateOrderStatus); // only change status (common in order systems)
// router.delete("/:id", protectAdmin, deleteCustomOrder);      // cancel / delete order

// export default router;