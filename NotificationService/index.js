import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';


const app = express();







app.use(express.json());
app.use(express.urlencoded({ extended: true }));



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






app.get('/', (req, res) => {
  res.send('order management backend is WORKING');
});

const port = process.env.PORT || 4040;
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  console.error('Mongo URI is missing! Please add it to your .env file.');
  process.exit(1);
}

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log('Notification Service Database connected successfully');
    app.listen(port, () => console.log('Server is running on port: ' + port));
  })
  .catch((err) => {
    console.error('Database connection error:', err);
    process.exit(1);
  });
