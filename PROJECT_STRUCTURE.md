# Tumamak Lodge Project Structure

This document provides a complete overview of the Tumamak Lodge project structure, including all folders and files, along with descriptions of their purposes.

## Project Overview

Tumamak Lodge is a full-stack web application for managing a lodge booking system. It consists of:
- **Frontend**: User-facing website built with React (frontend/)
- **Admin Panel**: Administrative interface built with React (admin/)
- **Backend**: REST API server built with Node.js/Express (backend/)
- **Shared Assets**: Static images and configuration files

## Environment Variables

- **Backend**: Requires a `.env` file in the `backend/` directory for database connection, JWT secrets, Cloudinary configuration, etc.
- **Frontend/Admin**: May use environment variables for API endpoints, but primarily configured via build-time variables.

## Complete File Tree

```
tumamak lodge/
├── .gitignore                    # Git ignore rules for all components
├── BACKEND_BOOKING_FIX.md        # Documentation for backend booking fixes
├── BOOKING_DISPLAY_FIX.md        # Documentation for booking display issues
├── BOOKING_PAGE_GUIDE.md         # Guide for booking page implementation
├── BOOKING_PAGE_VISUAL.md        # Visual guide for booking page
├── CHECKLIST.md                  # Project checklist and tasks
├── FILE_STRUCTURE.md             # File structure documentation
├── PRICE_DISPLAY_SUMMARY.md      # Summary of price display fixes
├── PRICE_DISPLAY_VISUAL_GUIDE.md # Visual guide for price display
├── PRICE_NAN_FIX.md              # Documentation for NaN price fixes
├── PRICING_POLICY.md             # Pricing policy documentation
├── PROFILE_BOOKINGS_FIX.md       # Profile bookings fix documentation
├── PROFILE_IMAGE_SETUP.md        # Profile image setup guide
├── PROFILE_PAGE_SUMMARY.md       # Profile page summary
├── README.md                     # Main project README
├── SETUP_GUIDE.md                # Setup and installation guide
├── admin/                        # Admin panel frontend (React/Vite)
│   ├── .gitignore
│   ├── eslint.config.js          # ESLint configuration for admin
│   ├── index.html                # Admin app entry point
│   ├── package-lock.json         # Admin dependencies lock file
│   ├── package.json              # Admin package configuration
│   ├── postcss.config.js         # PostCSS configuration
│   ├── README.md                 # Admin README
│   ├── tailwind.config.js        # Tailwind CSS configuration
│   ├── vite.config.js            # Vite build configuration
│   ├── public/                   # Static assets for admin
│   │   ├── profile.jpg
│   │   └── vite.svg
│   ├── src/                      # Admin source code
│   │   ├── App.css               # Admin app styles
│   │   ├── App.jsx               # Admin main app component
│   │   ├── index.css             # Admin global styles
│   │   ├── main.jsx              # Admin app entry point
│   │   ├── assets/               # Admin static assets
│   │   │   └── react.svg
│   │   ├── components/           # Reusable admin components
│   │   │   ├── AdminNavbar.jsx   # Admin navigation bar
│   │   │   ├── AdminSidebar.jsx  # Admin sidebar
│   │   │   ├── ProtectedRoute.jsx # Route protection for admin
│   │   │   └── ui/               # UI component library
│   │   │       ├── Alert.jsx
│   │   │       ├── Badge.jsx
│   │   │       ├── Button.jsx
│   │   │       ├── Card.jsx
│   │   │       ├── Dialog.jsx
│   │   │       ├── Input.jsx
│   │   │       ├── Label.jsx
│   │   │       ├── Select.jsx
│   │   │       ├── Table.jsx
│   │   │       └── Textarea.jsx
│   │   ├── lib/                  # Admin utilities
│   │   │   ├── axios.js          # HTTP client configuration
│   │   │   └── utils.js          # Utility functions
│   │   ├── pages/                # Admin page components
│   │   │   ├── BookingsManagement.jsx    # Bookings admin page
│   │   │   ├── ContactMessages.jsx       # Contact messages admin page
│   │   │   ├── Dashboard.jsx             # Admin dashboard
│   │   │   ├── Login.jsx                 # Admin login page
│   │   │   ├── RevenueAnalytics.jsx      # Revenue analytics page
│   │   │   ├── RoomsManagement.jsx       # Rooms management page
│   │   │   ├── UsersManagement.jsx       # Users management page
│   │   │   └── VehicleRentalsManagement.jsx # Vehicle rentals admin page
│   │   └── store/                # Admin state management (Zustand)
│   │       ├── authStore.js       # Authentication state
│   │       ├── bookingStore.js    # Booking state
│   │       ├── dashboardStore.js  # Dashboard state
│   │       ├── roomStore.js       # Room state
│   │       ├── userStore.js       # User state
│   │       └── vehicleStore.js    # Vehicle state
├── backend/                       # Backend API server (Node.js/Express)
│   ├── .gitignore
│   ├── package-lock.json          # Backend dependencies lock file
│   ├── package.json               # Backend package configuration
│   ├── README.md                  # Backend README
│   ├── server.js                  # Main server entry point
│   ├── config/                    # Backend configuration
│   │   ├── cloudinary.js          # Cloudinary image service config
│   │   └── db.js                  # Database connection config
│   ├── controllers/               # Route controllers
│   │   ├── analyticsController.js     # Analytics API logic
│   │   ├── authController.js          # Authentication API logic
│   │   ├── bookingController.js       # Booking API logic
│   │   ├── contactController.js       # Contact API logic
│   │   ├── contactMessageController.js # Contact message API logic
│   │   ├── galleryController.js       # Gallery API logic
│   │   ├── homepageController.js      # Homepage API logic
│   │   ├── reviewController.js        # Review API logic
│   │   ├── roomController.js          # Room API logic
│   │   ├── userController.js          # User API logic
│   │   └── vehicleRentalController.js # Vehicle rental API logic
│   ├── middleware/                # Express middleware
│   │   ├── authMiddleware.js      # Authentication middleware
│   │   ├── errorMiddleware.js     # Error handling middleware
│   │   └── uploadMiddleware.js    # File upload middleware
│   ├── models/                    # MongoDB models
│   │   ├── Booking.js             # Booking data model
│   │   ├── Contact.js             # Contact data model
│   │   ├── ContactMessage.js      # Contact message data model
│   │   ├── Gallery.js             # Gallery data model
│   │   ├── Homepage.js            # Homepage data model
│   │   ├── Review.js              # Review data model
│   │   ├── Room.js                # Room data model
│   │   ├── User.js                # User data model
│   │   └── VehicleRental.js       # Vehicle rental data model
│   ├── routes/                    # API route definitions
│   │   ├── analyticsRoutes.js     # Analytics routes
│   │   ├── authRoutes.js          # Authentication routes
│   │   ├── bookingRoutes.js       # Booking routes
│   │   ├── contactMessageRoutes.js # Contact message routes
│   │   ├── contactRoutes.js       # Contact routes
│   │   ├── galleryRoutes.js       # Gallery routes
│   │   ├── homepageRoutes.js      # Homepage routes
│   │   ├── reviewRoutes.js        # Review routes
│   │   ├── roomRoutes.js          # Room routes
│   │   ├── userRoutes.js          # User routes
│   │   └── vehicleRentalRoutes.js # Vehicle rental routes
│   ├── scripts/                   # Utility scripts
│   │   ├── seedData.js            # Database seeding script
│   │   ├── seedGallery.js         # Gallery seeding script
│   │   └── updateProfileImages.js # Profile image update script
│   ├── utils/                     # Backend utilities
│   │   ├── cloudinaryHelper.js    # Cloudinary utility functions
│   │   └── generateToken.js       # JWT token generation
├── frontend/                      # User frontend (React/Vite)
│   ├── .gitignore
│   ├── .stylelintrc.json          # Stylelint configuration
│   ├── eslint.config.js           # ESLint configuration
│   ├── index.html                 # Frontend app entry point
│   ├── package-lock.json          # Frontend dependencies lock file
│   ├── package.json               # Frontend package configuration
│   ├── postcss.config.js          # PostCSS configuration
│   ├── README.md                  # Frontend README
│   ├── tailwind.config.js         # Tailwind CSS configuration
│   ├── vite.config.js             # Vite build configuration
│   ├── public/                    # Static assets for frontend
│   │   ├── header.jpg
│   │   ├── profile.jpg
│   │   └── vite.svg
│   ├── src/                       # Frontend source code
│   │   ├── App.css                # Frontend app styles
│   │   ├── App.jsx                # Frontend main app component
│   │   ├── index.css              # Frontend global styles
│   │   ├── main.jsx               # Frontend app entry point
│   │   ├── assets/                # Frontend static assets
│   │   │   └── react.svg
│   │   ├── components/            # Reusable frontend components
│   │   │   ├── FloatingChat.jsx   # Floating chat component
│   │   │   ├── Footer.jsx         # Site footer
│   │   │   ├── Navbar.jsx         # Site navigation
│   │   │   ├── ProtectedRoute.jsx # Route protection
│   │   │   ├── RoomCard.jsx       # Room display card
│   │   │   └── ui/                # UI component library
│   │   │       ├── button.jsx
│   │   │       ├── card.jsx
│   │   │       ├── input.jsx
│   │   │       ├── label.jsx
│   │   │       └── textarea.jsx
│   │   ├── lib/                   # Frontend utilities
│   │   │   ├── axios.js           # HTTP client configuration
│   │   │   └── utils.js           # Utility functions
│   │   ├── pages/                 # Frontend page components
│   │   │   ├── BookingPage.jsx        # Booking page
│   │   │   ├── ContactPage.jsx        # Contact page
│   │   │   ├── GalleryPage.jsx        # Gallery page
│   │   │   ├── HomePage.jsx           # Home page
│   │   │   ├── LoginPage.jsx          # Login page
│   │   │   ├── ProfilePage.jsx        # User profile page
│   │   │   ├── RegisterPage.jsx       # Registration page
│   │   │   ├── RoomDetailPage.jsx     # Room details page
│   │   │   ├── RoomsPage.jsx          # Rooms listing page
│   │   │   └── VehiclesPage.jsx       # Vehicles page
│   │   └── store/                 # Frontend state management (Zustand)
│   │       ├── authStore.js           # Authentication state
│   │       ├── bookingStore.js        # Booking state
│   │       ├── galleryStore.js        # Gallery state
│   │       ├── reviewStore.js         # Review state
│   │       ├── roomStore.js           # Room state
│   │       └── vehicleRentalStore.js  # Vehicle rental state
└── images/                        # Shared static images
    ├── header.jpg                 # Header image
    └── profile.jpg                # Default profile image
```

## Key Directories Description

### Root Level
- **Documentation Files** (.md): Various guides, fixes, and summaries for development and maintenance
- **Configuration Files**: Git ignore rules and project setup guides

### Admin Directory (Frontend - React)
- **Purpose**: Administrative interface for managing lodge operations
- **Tech Stack**: React, Vite, Tailwind CSS, Zustand for state management
- **Key Features**: Room management, booking management, user management, analytics

### Backend Directory (Backend - Node.js)
- **Purpose**: REST API server handling all business logic
- **Tech Stack**: Node.js, Express.js, MongoDB with Mongoose
- **Key Components**:
  - Controllers: Handle API request logic
  - Models: MongoDB data schemas
  - Routes: API endpoint definitions
  - Middleware: Authentication, error handling, file uploads
  - Scripts: Database seeding and maintenance utilities

### Frontend Directory (Frontend - React)
- **Purpose**: User-facing website for lodge bookings and information
- **Tech Stack**: React, Vite, Tailwind CSS, Zustand for state management
- **Key Features**: Room browsing, booking system, user profiles, gallery

### Images Directory (Shared)
- **Purpose**: Static image assets used across the application
- **Contents**: Header images, default profile pictures
