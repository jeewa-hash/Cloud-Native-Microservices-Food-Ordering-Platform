import Cart from "../models/Cart.js";
import axios from "axios";

const MENU_SERVICE_URL = process.env.MENU_SERVICE_URL;

// Utility to compare sides
const sameSides = (a = [], b = []) =>
  a.length === b.length && a.every((s, i) => s.name === b[i].name && s.price === b[i].price);

// Fetch menu+restaurant details from menu service
async function fetchMenuWithRestaurant(menuId) {
  try {
    const response = await axios.get(`${MENU_SERVICE_URL}/menu/${menuId}/with-restaurant`);
    return response.data.data || null;
  } catch (error) {
    console.error("Menu with restaurant fetch failed:", error.message);
    return null;
  }
}

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { menuId, sides = [], quantity = 1 } = req.body;
    const userId = req.userId;

    // Fetch menu and restaurant details in one call
    const menu = await fetchMenuWithRestaurant(menuId);
    if (!menu) {
      return res.status(404).json({ success: false, message: "Menu not found" });
    }
    if (!menu.restaurant || !menu.restaurant._id) {
      return res.status(404).json({ success: false, message: "Restaurant not found" });
    }

    // Get or create user's cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) cart = new Cart({ user: userId, items: [] });

    // Find existing item
    const existingItem = cart.items.find(item =>
      item.menu.toString() === menuId && sameSides(item.sides, sides)
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        menu: menuId,
        name: menu.name,
        price: menu.price,
        image: menu.image,
        quantity,
        sides,
        restaurant: {
          _id: menu.restaurant._id,
          name: menu.restaurant.name,
          logo: menu.restaurant.logo,
          address: menu.restaurant.address,
          email: menu.restaurant.email,
          contactNumber: menu.restaurant.contactNumber,
          coverImage: menu.restaurant.coverImage,
          availableTime: menu.restaurant.availableTime
        }
      });
    }

    await cart.save();
    const cartData = await Cart.findById(cart._id).lean();
    res.json({ success: true, cart: cartData });
  } catch (error) {
    console.error("Cart error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get user's cart
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userId }).lean();
    if (!cart || !cart.items || cart.items.length === 0) {
      return res.json({ success: true, cart: { items: [] } });
    }
    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// Update quantity of a cart item
export const updateCartQuantity = async (req, res) => {
  try {
    const { menuId, sides, quantity } = req.body;
    const userId = req.userId;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    cart.items = cart.items
      .map(item =>
        item.menu.toString() === menuId && sameSides(item.sides, sides)
          ? { ...item.toObject(), quantity }
          : item
      )
      .filter(item => item.quantity > 0);

    await cart.save();
    const cartData = await Cart.findById(cart._id).lean();
    res.json({ success: true, cart: cartData });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const { menuId, sides } = req.body;
    const userId = req.userId;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    cart.items = cart.items.filter(item =>
      !(item.menu.toString() === menuId && sameSides(item.sides, sides))
    );

    await cart.save();
    const cartData = await Cart.findById(cart._id).lean();
    res.json({ success: true, cart: cartData });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};
