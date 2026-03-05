import mongoose from 'mongoose';
import axios from 'axios';
import 'dotenv/config';
import jwt from 'jsonwebtoken';

async function test() {
    process.env.MONGO_URI = "mongodb+srv://navod:navod123@cluster0.hftpe3e.mongodb.net/users_db?retryWrites=true&w=majority&appName=Cluster0";

    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;

    // Find admin user
    const admin = await db.collection('users').findOne({ role: 'admin' });
    if (!admin) {
        console.error("No admin found in DB!");
        process.exit(1);
    }
    console.log("Found admin:", admin.userName, admin.email);

    // Find a shop user to get a shopId
    const shop = await db.collection('users').findOne({ role: 'shop' });

    // Generate token
    const payload = {
        user: {
            id: admin._id.toString(),
            role: admin.role
        }
    };

    const token = jwt.sign(payload, "fallback_secret_key", { expiresIn: '1d' });
    console.log("Token generated locally.");

    const productPayload = {
        name: 'Belt Test',
        price: '1200.00',
        description: 'New Belt for Mens',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd',
        category: 'Clothing',
        isAvailable: true,
        shopId: shop._id.toString()
    };

    try {
        const response = await axios.post('http://localhost:4040/api/products', productPayload, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("SUCCESS:", response.data);
    } catch (e) {
        if (e.response) {
            console.error("HTTP ERROR:", e.response.status, e.response.data);
        } else {
            console.error("NETWORK ERROR:", e.cause || e.message);
        }
    }

    process.exit(0);
}

test();
