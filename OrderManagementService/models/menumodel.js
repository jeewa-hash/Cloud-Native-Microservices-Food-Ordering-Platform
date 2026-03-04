import mongoose from "mongoose";

const SideSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  label: { type: String, enum: ["Popular", "Add On", ""], default: "" },
});

const MenuSchema = new mongoose.Schema({
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  image: String,
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
  sides: [
    {
      title: { type: String },
      maxChoose: { type: Number, default: 1 },
      options: [SideSchema],
    }
  ],
  popular: { type: Boolean, default: false }, // <-- Popular field
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Menu", MenuSchema);
