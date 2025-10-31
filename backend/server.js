import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import userRoutes from './routes/userRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';
import vehicleRentalRoutes from './routes/vehicleRentalRoutes.js';
import homepageRoutes from './routes/homepageRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import contactMessageRoutes from './routes/contactMessageRoutes.js';
import { errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();

// Connect to Database
connectDB();

// CORS configuration
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/vehicle-rentals', vehicleRentalRoutes);
app.use('/api/homepage', homepageRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/contact-messages', contactMessageRoutes);

// Root route for Render health check
app.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'Tumamak Lodge API is running' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Tumamak Lodge API is running' });
});

// Serve repository images folder (located at repo root `/images`) so frontend can request image files directly
// e.g. /images/room images/room1.jpg
// When this server runs from the `backend/` folder, process.cwd() is backend/, so the repo images folder is one level up.
const imagesPath = path.join(process.cwd(), '..', 'images');
app.use('/images', express.static(imagesPath));

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
