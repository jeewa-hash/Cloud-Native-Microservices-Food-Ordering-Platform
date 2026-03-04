import "../models/User.js";
import "../models/restaurantmodel.js";
import "../models/menumodel.js";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import mongoose from "mongoose";
import axios from "axios";

const RESTAURANT_SERVICE_URL = process.env.RESTAURANT_SERVICE_URL;
const USER_SERVICE_URL = process.env.USER_SERVICE_URL;


// -----------------------------
// OPTIONAL: Fetch restaurant
// -----------------------------
async function fetchRestaurant(restaurantId) {
  try {
    const response = await axios.get(
      `${RESTAURANT_SERVICE_URL}/restaurant/${restaurantId}`
    );
    return response.data.data || null;
  } catch (error) {
    console.error("Restaurant fetch failed:", error.message);
    return null;
  }
}

// -----------------------------
// OPTIONAL: Fetch user
// -----------------------------
async function fetchUser(userId) {
  try {
    const response = await axios.get(
      `${USER_SERVICE_URL}/user/${userId}`
    );
    return response.data.data || null;
  } catch (error) {
    console.error("User fetch failed:", error.message);
    return null;
  }
}

// ==========================================================
// CHECKOUT ORDER 
// ==========================================================
export const checkoutOrder = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    await session.startTransaction();

    const {
      address,
      phone,
      paymentMethod = "cod",
      deliveryType,
      instructions = "",
      shippingFee = 109,
    } = req.body;

    // Validate required fields
    const requiredFields = ["address", "phone", "deliveryType"];
    const missingFields = requiredFields.filter(
      (field) => !req.body[field]
    );

    if (missingFields.length > 0) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    // Get cart
    const cart = await Cart.findOne({ user: req.userId }).session(session);

    if (!cart || cart.items.length === 0) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Your cart is empty",
      });
    }

    // Group items by restaurant
    const itemsByRestaurant = {};

    cart.items.forEach((item) => {
      const restId =
        typeof item.restaurant === "object"
          ? item.restaurant._id
          : item.restaurant;

      if (!itemsByRestaurant[restId]) {
        itemsByRestaurant[restId] = [];
      }

      itemsByRestaurant[restId].push(item);
    });

    const createdOrders = [];

    for (const [restaurantId, items] of Object.entries(
      itemsByRestaurant
    )) {
      const validatedItems = items.map((item) => ({
        menu: item.menu,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity,
        sides: (item.sides || []).map((side) => ({
          name: side.name,
          price: side.price,
        })),
      }));

      const subtotal = validatedItems.reduce((sum, item) => {
        const sidesTotal =
          (item.sides?.reduce((s, side) => s + side.price, 0) ||
            0) * item.quantity;

        return sum + item.price * item.quantity + sidesTotal;
      }, 0);

      const total = subtotal + shippingFee;

      const order = new Order({
        user: req.userId,
        restaurant: restaurantId,
        address,
        phone,
        paymentMethod,
        paymentStatus: "pending", 
        deliveryType,
        instructions,
        shippingFee,
        subtotal,
        total,
        items: validatedItems,
        status: "pending",
      });

      await order.save({ session });
      createdOrders.push(order);
    }

    // Clear cart after order placed
    await Cart.deleteOne({ _id: cart._id }).session(session);

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      orders: createdOrders,
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({
      success: false,
      message: error.message || "Checkout failed",
    });
  } finally {
    session.endSession();
  }
};


// GET USER ORDERS

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .sort("-createdAt")
      .populate("restaurant", "name logo address")
      .populate("items.menu", "name image price")
      .lean();

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// RESTAURANT VIEW ORDERS

export const getRestaurantOrders = async (req, res) => {
  try {
    const restaurantId = req.restaurantId;

    const orders = await Order.find({ restaurant: restaurantId })
      .sort("-createdAt")
      .populate("user", "name email")
      .lean();

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// UPDATE ORDER STATUS (Restaurant)

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "pending",
      "confirmed",
      "processing",
      "preparing",
      "handover",
      "out for delivery",
      "delivered",
    ];

    if (!validStatuses.includes(status?.toLowerCase())) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

