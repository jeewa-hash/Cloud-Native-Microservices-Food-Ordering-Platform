import Cart from "../models/Cart.js";
import axios from "axios";

const SHOP_SERVICE_URL = process.env.SHOP_SERVICE_URL;
const sameProduct = (a, b) => a.toString() === b.toString();

// Fetch product from Shop Service
async function fetchProduct(productId) {
  try {
    const response = await axios.get(`${SHOP_SERVICE_URL}?id=${productId}`);
    const product = Array.isArray(response.data) ? response.data[0] : response.data;
    return product || null;
  } catch (error) {
    console.error("Product fetch failed:", error.message);
    return null;
  }
}


// Add item to cart

export const addToCart = async (req, res) => {
  try {
    const userId = req.userId; 
    const { productId, quantity = 1 } = req.body;
    if (!productId) return res.status(400).json({ success: false, message: "productId is required" });

    let cart = await Cart.findOne({ user: userId });
    if (!cart) cart = new Cart({ user: userId, items: [] });

    const product = await fetchProduct(productId);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    const existingItem = cart.items.find(item => sameProduct(item.product, productId));
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity,
        shop: { _id: product.shopId, name: product.shopName, logo: product.shopLogo }
      });
    }

    await cart.save();
    const cartData = await Cart.findOne({ user: userId }).lean();
    res.json({ success: true, cart: cartData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get user's cart
export const getCart = async (req, res) => {
  try {
    const userId = req.userId;
    const cart = await Cart.findOne({ user: userId }).lean();
    res.json({ success: true, cart: cart || { items: [] } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Update quantity
export const updateCartQuantity = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId, quantity } = req.body;
    if (!productId) return res.status(400).json({ success: false, message: "productId is required" });

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    cart.items = cart.items
      .map(item => sameProduct(item.product, productId) ? { ...item.toObject(), quantity } : item)
      .filter(item => item.quantity > 0);

    await cart.save();
    res.json({ success: true, cart: await Cart.findOne({ user: userId }).lean() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Remove single item
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ success: false, message: "productId is required" });

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    cart.items = cart.items.filter(item => !sameProduct(item.product, productId));
    await cart.save();
    res.json({ success: true, cart: await Cart.findOne({ user: userId }).lean() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Clear cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.userId;
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    cart.items = [];
    await cart.save();
    res.json({ success: true, message: "Cart cleared", cart: await Cart.findOne({ user: userId }).lean() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};