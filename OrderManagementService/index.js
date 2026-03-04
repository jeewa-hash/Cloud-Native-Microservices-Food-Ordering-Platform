import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";

const app = express();

// ----------------------
// CORS configuration
// ----------------------
const allowedOrigins = [
  'http://localhost:3000', // frontend URL
  'http://127.0.0.1:3000', 
  'http://localhost:5173',// another dev URL
  // add other allowed origins here
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); 
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('The CORS policy for this site does not allow access from the specified origin.'));
      }
    }
  })
);

// Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/order", orderRoutes);
app.use("/api/cart", cartRoutes);

app.get('/', (req, res) => {
  res.send('Order Management Backend is WORKING ✅');
});

// Start server and connect DB
const port = process.env.PORT || 4000;
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  console.error('Mongo URI is missing! Please add it to your .env file.');
  process.exit(1);
}

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log('Order Management Service Database connected successfully');
    app.listen(port, () => console.log(`Server is running on port: ${port}`));
  })
  .catch((err) => {
    console.error('Database connection error:', err);
    process.exit(1);
  });