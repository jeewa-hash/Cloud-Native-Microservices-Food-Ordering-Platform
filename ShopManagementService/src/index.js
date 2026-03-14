import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';

// Routes ආනයනය කිරීම (Importing Routes)
import productRoutes from './routes/productRoutes.js';
import shopRoutes from './routes/shopRoutes.js';

const app = express();

// Middleware
// Increase request body size limits to handle large payloads (e.g., base64 images)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS සැකසුම් (Allowed Origins ලැයිස්තුව ඇතුළත් කර ඇත)
const allowedOrigins = [
  'http://localhost:3000', // Frontend local development
  'http://localhost:5173', // Vite standard port
  process.env.FRONTEND_URL  // Cloud එකේ deploy කළ පසු ලැබෙන URL එක
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Origin එකක් නොමැති අවස්ථා (Mobile apps/Postman) වලට ඉඩ දීම
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error('The CORS policy for this site does not allow access from the specified origin.'));
      }
    },
    credentials: true
  })
);

// --- API Routes ---
// Shop Management සඳහා වන ප්‍රධාන Route එක
app.use('/api/products', productRoutes);
app.use('/api/shops', shopRoutes);

//TO show ci cd pipe line is working
app.get('/', (req, res) => {
  res.send('<h1>🚀 CI/CD Pipeline Test: SUCCESS!</h1><p>Hii..</p>');
});

// // Base Route
// app.get('/', (req, res) => {
//   res.send('Shop Management Service Backend is WORKING');
// });

const port = process.env.PORT || 4040;
const mongoURI = process.env.MONGO_URI;

// Database Connection Logic
if (!mongoURI) {
  console.error('Mongo URI is missing! Please add it to your .env file.');
  process.exit(1);
}

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log('Shop Management Service Database connected successfully');
    // Database එක සම්බන්ධ වූ පසු පමණක් Server එක ආරම්භ වේ
    app.listen(port, () => {
      // CI/CD පරීක්ෂාව සඳහා එක් කළ පණිවිඩය
      console.log('CI/CD Pipeline Test: New build deployed and running successfully!');
      console.log(`Server is running on port: ${port}`);
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err);
    process.exit(1);
  });