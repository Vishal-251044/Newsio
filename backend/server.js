import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors'; 
import authRoutes from './routes/authRoutes.js';
import newsRoutes from './routes/newsRoutes.js';
import profileNewsRoutes from './routes/profileNewsRoutes.js';
import removeNewsRoutes from './routes/removeNewsRoutes.js';
import homeRoutes from './routes/homeRoutes.js';
import likeRoutes from "./routes/likeRoutes.js";
import nlpRoutes from "./routes/nlpRoutes.js";

dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use CORS middleware to allow requests from any origin
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/news', profileNewsRoutes);
app.use("/api/news", removeNewsRoutes);
app.use('/', homeRoutes);
app.use('/api', likeRoutes);
app.use("/nlp", nlpRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
