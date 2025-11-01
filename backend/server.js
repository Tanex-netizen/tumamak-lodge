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

// CORS configuration - read from env or use local defaults
const rawOrigins = process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://localhost:5174,http://localhost:5175';
const allowedOrigins = rawOrigins.split(',').map(s => s.trim()).filter(Boolean);

console.log('🔐 Allowed CORS origins:', allowedOrigins);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (curl, mobile apps, server-to-server)
    if (!origin) return callback(null, true);
    // Accept if origin is in the allowed list or wildcard is set
    if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    console.warn('⚠️ CORS blocked origin:', origin);
    return callback(null, false);
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

// Handle preflight globally
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

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

// Temporary seed endpoint - REMOVE AFTER FIRST USE
app.get('/api/seed-now', async (req, res) => {
  try {
    const { default: runSeed } = await import('./scripts/seedData.js');
    await runSeed();
    res.json({ success: true, message: 'Database seeded successfully!' });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Temporary vehicle seed endpoint - REMOVE AFTER FIRST USE
app.get('/api/seed-vehicles', async (req, res) => {
  try {
    const { default: seedVehicles } = await import('./scripts/seedVehicles.js');
    await seedVehicles();
    res.json({ success: true, message: 'Vehicles seeded successfully!' });
  } catch (error) {
    console.error('Vehicle seed error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Serve images from repo root `/images`
const imagesPath = path.join(process.cwd(), '..', 'images');
app.use('/images', express.static(imagesPath));

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; // Bind to all interfaces for Render

app.listen(PORT, HOST, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
