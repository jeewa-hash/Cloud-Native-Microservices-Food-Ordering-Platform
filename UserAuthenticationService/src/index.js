import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Load environment variables
dotenv.config();

const app = express();

const corsOptions = {
    origin: process.env.FRONTEND_URL || "*", // .env එකේ ඇති URL එකට පමණක් ඉඩ ලබා දේ
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Database Connection & Server Start
const PORT = process.env.PORT || 5002; // Using 5001 to avoid conflicting with other services
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('Connected to MongoDB successfully.');
        try {
            await mongoose.connection.collection('users').dropIndex('nic_1');
            console.log('Dropped legacy index nic_1');
        } catch (e) {
            console.log('');
        }
        app.listen(PORT, () => {
            console.log(`User Authentication Service is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit process with failure
    });
