import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import mongoose from "mongoose";
import axios from "axios";

const SHOP_SERVICE_URL = process.env.SHOP_SERVICE_URL;

// Optional: fetch product details from Shop service
async function fetchProduct(productId) {
  try {
    const response = await axios.get(`${SHOP_SERVICE_URL}/products/${productId}`);
    return response.data || null;
  } catch (error) {
    console.error("Product fetch failed:", error.message);
    return null;
  }
}

// CHECKOUT ORDER
export const checkoutOrder = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    await session.startTransaction();

    const { address, phone, paymentMethod = "cod", deliveryType, instructions = "", shippingFee = 109 } = req.body;

    // Validate required fields
    const requiredFields = ["address", "phone", "deliveryType"];
    const missingFields = requiredFields.filter(f => !req.body[f]);
    if (missingFields.length) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: `Missing required fields: ${missingFields.join(", ")}` });
    }

    // Get user's cart
    const cart = await Cart.findOne({ user: req.userId }).session(session);
    if (!cart || cart.items.length === 0) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: "Your cart is empty" });
    }

    // Group items by shop
    const itemsByShop = {};
    cart.items.forEach(item => {
      const shopId = item.shop._id;
      if (!itemsByShop[shopId]) itemsByShop[shopId] = [];
      itemsByShop[shopId].push(item);
    });

    const createdOrders = [];

    for (const [shopId, items] of Object.entries(itemsByShop)) {
      const validatedItems = [];
      let subtotal = 0;

      for (const item of items) {
        const productData = await fetchProduct(item.product);
        const price = productData?.price || item.price; 
        validatedItems.push({
          product: item.product,
          name: item.name,
          price,
          image: item.image,
          quantity: item.quantity,
        });
        subtotal += price * item.quantity;
      }

      const total = subtotal + shippingFee;

      const order = new Order({
        user: req.userId,
        shop: {
          _id: shopId,
          name: items[0].shop.name,
          logo: items[0].shop.logo,
        },
        items: validatedItems,
        address,
        phone,
        paymentMethod,
        paymentStatus: "pending",
        deliveryType,
        instructions,
        shippingFee,
        subtotal,
        total,
        status: "pending",
        timeline: [{ status: "pending" }],
      });

      await order.save({ session });
      createdOrders.push(order);
    }

    // Clear cart after checkout
    await Cart.deleteOne({ _id: cart._id }).session(session);

    await session.commitTransaction();
    res.status(201).json({ success: true, orders: createdOrders });

  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ success: false, message: error.message });
  } finally {
    session.endSession();
  }
};

// ==========================================================
// GET USER ORDERS
// ==========================================================
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .sort("-createdAt")
      .lean();

    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================================
// GET SHOP ORDERS
// ==========================================================
export const getShopOrders = async (req, res) => {
  try {
    const orders = await Order.find({ "shop._id": req.shopId })
      .sort("-createdAt")
      .lean();

    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================================
// UPDATE ORDER STATUS (SHOP OWNER)
// ==========================================================
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending","accepted","preparing","ready","picked-up","delivered","completed","declined"];
    if (!validStatuses.includes(status)) return res.status(400).json({ success: false, message: "Invalid status" });

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status, $push: { timeline: { status } } },
      { new: true }
    );

    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};