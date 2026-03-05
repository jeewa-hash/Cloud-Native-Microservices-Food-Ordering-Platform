import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    // Essential Authentication Fields
    userName: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },

    // Personal Information
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },

    // Role Management
    role: {
        type: String,
        enum: ["customer", "shop", "admin"],
        default: "customer",
        required: true
    },

    // Optional: Support multiple roles if needed
    roles: [{
        type: String,
        enum: ["customer", "shop", "admin"]
    }],

    // Contact Information
    phone: {
        type: String
    },

    // Account Status
    isActive: {
        type: Boolean,
        default: true
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },

    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("User", UserSchema);
