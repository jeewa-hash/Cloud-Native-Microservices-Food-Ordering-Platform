import Cart from "../models/Cart.js";
import axios from "axios";

const SHOP_SERVICE_URL = process.env.SHOP_SERVICE_URL;
const sameProduct = (a, b) => a.toString() === b.toString();

// Fetch product from Shop Service
async function fetchProduct(productId) {
  try {
    const response = await axios.get(`${SHOP_SERVICE_URL}/${productId}`); // fetch single product
    return response.data || null;
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

    if (!productId) {
      return res.status(400).json({ success: false, message: "productId is required" });
    }

    // Fetch the product details
    const product = await fetchProduct(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) cart = new Cart({ user: userId, items: [] });

    // Check if item already exists
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
    console.error("Get cart error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Update quantity
export const updateCartQuantity = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId, quantity } = req.body;
    
    if (!productId) {
      return res.status(400).json({ success: false, message: "productId is required" });
    }
    
    if (quantity < 0) {
      return res.status(400).json({ success: false, message: "Quantity cannot be negative" });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    // FIX: Update quantity properly
    const itemIndex = cart.items.findIndex(item => 
      item.product && item.product.toString() === productId.toString()
    );

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: "Item not found in cart" });
    }

    if (quantity === 0) {
      // Remove item if quantity is 0
      cart.items.splice(itemIndex, 1);
    } else {
      // Update quantity
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    
    const updatedCart = await Cart.findOne({ user: userId }).lean();
    res.json({ success: true, cart: updatedCart });
    
  } catch (error) {
    console.error("Update cart error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Remove single item
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId } = req.body;
    
    if (!productId) {
      return res.status(400).json({ success: false, message: "productId is required" });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    // FIX: Filter out the item properly
    cart.items = cart.items.filter(item => 
      !(item.product && item.product.toString() === productId.toString())
    );
    
    await cart.save();
    
    const updatedCart = await Cart.findOne({ user: userId }).lean();
    res.json({ success: true, cart: updatedCart });
    
  } catch (error) {
    console.error("Remove from cart error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Clear cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.userId;
    const cart = await Cart.findOne({ user: userId });
    
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    cart.items = [];
    await cart.save();
    
    const updatedCart = await Cart.findOne({ user: userId }).lean();
    res.json({ 
      success: true, 
      message: "Cart cleared", 
      cart: updatedCart 
    });
    
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};