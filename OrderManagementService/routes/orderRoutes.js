import express from "express";
import authUser from "../middleware/auth.js";
import { checkoutOrder, getOrders, getShopOrders, updateOrderStatus } from "../controllers/orderController.js";

const router = express.Router();

// customer routes
router.post("/checkout", authUser, checkoutOrder);
router.get("/history", authUser, getOrders);

// shop routes - protected but implementation inside controller will check role
router.get("/shop", authUser, getShopOrders);
router.patch("/shop/:orderId/status", authUser, updateOrderStatus);

export default router;

