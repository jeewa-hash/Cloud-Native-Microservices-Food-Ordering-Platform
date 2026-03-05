import Product from "../models/Product.js";
import axios from "axios";

// @desc    Add new product (With Inter-service communication)
export const addProduct = async (req, res) => {
  try {
    const { name, price, description, image, category, isAvailable } = req.body;
    const shopId = req.user.id; // JWT Middleware එකෙන් ලැබෙන ID එක

    let shopName = "Unknown Shop";
    let shopLogo = "";

    // --- Integration Point: Auth Service එකෙන් දත්ත ලබා ගැනීම ---
    try {

      const authResponse = await axios.get(`${process.env.AUTH_SERVICE_URL}/api/users/${shopId}`);

      if (authResponse.data) {
        shopName = authResponse.data.name || authResponse.data.username;
        shopLogo = authResponse.data.logo || "";
      }
    } catch (authError) {
      console.error("Breack connection between Auth Service and Shop Management Service:", authError.message);
      // සන්නිවේදනය අසාර්ථක වුවත් product එක save කිරීමට ඉඩ දීම හෝ error එකක් දීම කළ හැක
    }

    const product = await Product.create({
      name,
      price,
      description,
      image,
      category,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      shopId,
      shopName, // Auth service එකෙන් ලබාගත් නම
      shopLogo  // Auth service එකෙන් ලබාගත් ලෝගෝව
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all products (Public)
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ isAvailable: true });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get product by Product ID (Public)
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get products by Shop ID (Public)
export const getProductsByShop = async (req, res) => {
  try {
    const products = await Product.find({ shopId: req.params.shopId });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update product (Shop owner only)
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    // භාණ්ඩය අයිති shop එකටම පමණක් update කිරීමට ඉඩ දීම (Security principle [cite: 38])
    if (product && product.shopId.toString() === req.user.id) {
      Object.assign(product, req.body);
      await product.save();
      res.json(product);
    } else {
      res.status(403).json({ message: "You are not authorized to update this product." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product && product.shopId.toString() === req.user.id) {
      await product.deleteOne();
      res.json({ message: "Product removed" });
    } else {
      res.status(403).json({ message: "You are not authorized to delete this product." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};