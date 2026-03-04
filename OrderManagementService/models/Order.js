import mongoose from "mongoose";

const SideSchema = new mongoose.Schema({
  name: String,
  price: Number,
  label: String,
});

const OrderItemSchema = new mongoose.Schema({
  menu: { type: mongoose.Schema.Types.ObjectId, ref: "Menu", required: true },
  name: String,
  price: Number,
  image: String,
  quantity: Number,
  sides: [SideSchema],
});

const TimelineSchema = new mongoose.Schema({
  status: String,
  at: { type: Date, default: Date.now }
});

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
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
    enum: [
      "pending", "accepted", "preparing", "ready", "waiting-for-delivery",
      "picked-up", "delivered", "completed", "declined"
    ],
    default: "pending"
  },
  timeline: [TimelineSchema],
 
  
  createdAt: { type: Date, default: Date.now }});

export default mongoose.model("Order", OrderSchema);
