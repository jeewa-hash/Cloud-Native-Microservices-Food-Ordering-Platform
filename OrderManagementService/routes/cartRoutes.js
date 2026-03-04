
import express from "express";
import authUser from "../middleware/auth.js";
import {addToCart,getCart,updateCartQuantity, removeFromCart,} from "../controllers/cartController.js";

const router = express.Router();

router.get("/", authUser, getCart);
router.post("/add", authUser, addToCart);
router.put("/update", authUser, updateCartQuantity);
router.delete("/remove", authUser, removeFromCart);

export default router;