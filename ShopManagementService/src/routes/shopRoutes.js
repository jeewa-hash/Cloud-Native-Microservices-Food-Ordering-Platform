import express from "express";
import { getAllShops, getShopOrders, updateOrderStatus } from "../controllers/shopController.js";
import { protect, authorizeShop } from "../middleware/authMiddleware.js";

const router = express.Router();

// public endpoints
router.get("/", getAllShops);

// shop protected endpoints
router.get("/orders", protect, authorizeShop, getShopOrders);
router.patch("/orders/:orderId/status", protect, authorizeShop, updateOrderStatus);

export default router;
