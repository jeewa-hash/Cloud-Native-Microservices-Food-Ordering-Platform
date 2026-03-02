import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipientId: { type: String, required: true },
    recipientType: { type: String, required: true }, // USER or RESTAURANT
    type: { type: String, required: true }, // ORDER_CREATED, ORDER_CONFIRMED
    title: String,
    message: String,
    relatedId: String,
    isRead: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);