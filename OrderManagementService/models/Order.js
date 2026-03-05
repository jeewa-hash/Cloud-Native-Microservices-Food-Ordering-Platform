import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name: String,
  price: Number,
  image: String,
  quantity: Number,
});

const TimelineSchema = new mongoose.Schema({
  status: String,
  at: { type: Date, default: Date.now }
});

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  shop: {
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: String,
    logo: String,
  },
  items: [OrderItemSchema],
  address: { type: String, required: true },
  phone: String,
  paymentMethod: { type: String, default: "cod" },
  paymentStatus: { type: String, default: "pending" },
  deliveryType: String,
  instructions: String,
  shippingFee: Number,
  subtotal: Number,
  total: Number,
  status: {
    type: String,
    enum: ["pending", "accepted", "preparing", "ready", "picked-up", "delivered", "completed", "declined"],
    default: "pending"
  },
  timeline: [TimelineSchema],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Order", OrderSchema);