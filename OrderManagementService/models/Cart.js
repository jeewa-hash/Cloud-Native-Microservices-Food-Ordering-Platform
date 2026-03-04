import mongoose from "mongoose";

const SideSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  label: { type: String, default: "" },
});

const CartItemSchema = new mongoose.Schema({
  menu: { type: mongoose.Schema.Types.ObjectId, ref: "Menu", required: true },
  name: String,
  price: Number,
  image: String,
  quantity: { type: Number, default: 1 },
  sides: [SideSchema],
  restaurant: {
    _id: { type: mongoose.Schema.Types.ObjectId, required: true  },
    name: String,
    logo: String,
    address: String,
    email: String,
    contactNumber: String,
    coverImage: String,
    availableTime: String
  }
});

const CartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [CartItemSchema],
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Cart", CartSchema);
