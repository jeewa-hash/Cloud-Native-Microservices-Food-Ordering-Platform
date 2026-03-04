import express from "express";
import { addProduct, getAllProducts, getProductsByShop, updateProduct, deleteProduct } from "../controllers/productController.js";
import { protect, authorizeShop } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorizeShop, addProduct);
router.get("/", getAllProducts);
router.get("/shops/:shopId", getProductsByShop);
router.put("/:id", protect, authorizeShop, updateProduct);
router.delete("/:id", protect, authorizeShop, deleteProduct);

export default router;