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

// CORS configuration - allow configuring allowed origins via env var
// Set ALLOWED_ORIGINS as a comma-separated list in production (e.g.
// ALLOWED_ORIGINS="https://tumamak-frontend.onrender.com,https://tumamak-admin.onrender.com")
const rawOrigins = process.env.ALLOWED_ORIGINS || '';
const allowedOrigins = rawOrigins
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

// default local origins for dev when ALLOWED_ORIGINS is not set
if (allowedOrigins.length === 0) {
  allowedOrigins.push(
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:3000'
  );
}

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (curl, server-to-server)
    if (!origin) return callback(null, true);
    // Accept if origin is explicitly allowed or wildcard is set
    if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    // Not allowed - do not throw an error here (that can cause a 500).
    // Return false so CORS middleware will simply not set CORS headers.
    return callback(null, false);
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

// Enable preflight across the board (respond to OPTIONS requests)
app.options('*', cors(corsOptions));

// Add some permissive headers for allowed requests (Content-Type, Authorization, etc.)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  next();
});

// Middleware
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
