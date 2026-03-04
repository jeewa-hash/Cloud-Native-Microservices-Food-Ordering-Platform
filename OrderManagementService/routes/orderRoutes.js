import express from "express";
import authUser from "../middleware/auth.js";
import { checkoutOrder, getOrders } from "../controllers/orderController.js";

const router = express.Router();


router.post("/checkout", authUser, checkoutOrder);

router.get("/history", authUser, getOrders);

export default router;

