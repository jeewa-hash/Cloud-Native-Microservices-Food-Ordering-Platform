import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  image: { type: String },
  category: { 
    type: String, 
    enum: ["Food", "Electronics", "Clothing", "Grocery", "Other"], 
    required: true 
  },
  // User/Auth service එකෙන් ලැබෙන ප්‍රධාන යතුර
  shopId: { type: mongoose.Schema.Types.ObjectId, required: true }, 
  
  // සන්නිවේදනය (Integration) හරහා ලබාගන්නා අමතර දත්ත
  shopName: { type: String }, 
  shopLogo: { type: String },

  isAvailable: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Product", ProductSchema);