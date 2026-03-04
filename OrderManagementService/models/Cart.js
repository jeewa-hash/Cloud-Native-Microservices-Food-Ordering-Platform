import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name: String,
  price: Number,
  image: String,
  quantity: { type: Number, default: 1 },
  shop: {
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: String,
    logo: String,
  }
});

const CartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // <-- user required
  items: [CartItemSchema],
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Cart", CartSchema);