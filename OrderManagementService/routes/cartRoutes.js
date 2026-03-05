import express from "express";
import authUser from "../middleware/auth.js";
import { addToCart, getCart, updateCartQuantity, removeFromCart, clearCart } from "../controllers/cartController.js";

const router = express.Router();

router.get("/", authUser, getCart);              
router.post("/add", authUser, addToCart);       
router.put("/update", authUser, updateCartQuantity); 
router.delete("/remove", authUser, removeFromCart);  
router.delete("/clear", authUser, clearCart);

export default router;