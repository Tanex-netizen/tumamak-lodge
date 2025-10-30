# Tumamak Lodge - Backend API

Backend API for Tumamak Lodge Booking System built with Node.js, Express, and MongoDB.

## Features

- User authentication with JWT
- Room management and availability checking
- Booking system with real-time availability
- Review and rating system
- Vehicle rental management
- Gallery management
- Homepage content management
- Analytics and revenue tracking
- Contact form management

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Cloudinary for image uploads
- Bcrypt for password hashing

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

3. Update the `.env` file with your configuration:
- MongoDB URI
- JWT Secret
- Cloudinary credentials
- Email configuration (optional)

4. Seed the database with sample data:
```bash
npm run seed
```

This will create:
- Admin user (email: admin@tumamaklodge.com, password: admin123)
- 16 sample rooms (8 Ground Floor + 8 Upstairs)
- Homepage content

### Running the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Rooms
- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/:id` - Get room by ID
- `POST /api/rooms` - Create room (Admin)
- `PUT /api/rooms/:id` - Update room (Admin)
- `DELETE /api/rooms/:id` - Delete room (Admin)
- `POST /api/rooms/check-availability` - Check availability
- `GET /api/rooms/:id/booked-dates` - Get booked dates

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get all bookings (Admin)
- `GET /api/bookings/my-bookings` - Get user bookings
- `GET /api/bookings/:id` - Get booking by ID
- `PUT /api/bookings/:id/status` - Update booking status (Admin)
- `PUT /api/bookings/:id/payment` - Update payment status (Admin)
- `PUT /api/bookings/:id/cancel` - Cancel booking
- `DELETE /api/bookings/:id` - Delete booking (Admin)

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/room/:roomId` - Get room reviews
- `GET /api/reviews` - Get all reviews (Admin)
- `PUT /api/reviews/:id/approve` - Update review approval (Admin)
- `DELETE /api/reviews/:id` - Delete review (Admin)

### Vehicles
- `GET /api/vehicles` - Get all vehicles
- `GET /api/vehicles/:id` - Get vehicle by ID
- `POST /api/vehicles` - Create vehicle (Admin)
- `PUT /api/vehicles/:id` - Update vehicle (Admin)
- `DELETE /api/vehicles/:id` - Delete vehicle (Admin)

### Gallery
- `GET /api/gallery` - Get gallery images
- `POST /api/gallery` - Upload image (Admin)
- `PUT /api/gallery/:id` - Update image (Admin)
- `DELETE /api/gallery/:id` - Delete image (Admin)

### Homepage
- `GET /api/homepage` - Get homepage content
- `GET /api/homepage/:section` - Get specific section
- `POST /api/homepage/:section` - Update section (Admin)

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard analytics (Admin)
- `GET /api/analytics/revenue` - Get revenue analytics (Admin)
- `GET /api/analytics/bookings` - Get booking statistics (Admin)

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all messages (Admin)
- `GET /api/contact/:id` - Get message by ID (Admin)
- `PUT /api/contact/:id` - Update message (Admin)
- `DELETE /api/contact/:id` - Delete message (Admin)

### Users
- `GET /api/users` - Get all users (Admin)
- `GET /api/users/:id` - Get user by ID (Admin)
- `POST /api/users` - Create user (Admin)
- `PUT /api/users/:id` - Update user (Admin)
- `DELETE /api/users/:id` - Delete user (Admin)

## User Roles

- **customer**: Regular users who can book rooms
- **staff**: Can manage bookings and rooms
- **admin**: Full access to all features

## License

ISC
