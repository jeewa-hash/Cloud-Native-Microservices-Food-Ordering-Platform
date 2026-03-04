import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  availableTime: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    default: "",
  },
  coverImage: {
    type: String,
    default: "",
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

export default mongoose.model("Restaurant", restaurantSchema);
