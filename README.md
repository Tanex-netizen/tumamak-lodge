# Tumamak Lodge - Full Stack Booking Website

A comprehensive full-stack lodge booking website built with the MERN stack (MongoDB, Express.js, React, Node.js), featuring separate frontend, backend, and admin panel applications.

## 🏗️ Project Structure

```
tumamak-lodge/
├── backend/          # Node.js + Express API
├── frontend/         # React customer-facing application
└── admin/            # React admin panel
```

## ✨ Features

### Customer Features
- User registration and authentication with JWT
- Browse and search available rooms (16 rooms: 8 Ground Floor + 8 Upstairs)
- Real-time room availability checking with calendar view
- Book rooms with date selection and guest information
- View booking history and itinerary
- Review and rate rooms after checkout
- Browse vehicle rentals
- View gallery images
- Contact form
- User profile management with profile image upload
- Mobile responsive design
- Light brown aesthetic theme
- Smooth animations with Framer Motion

### Admin Features
- Dashboard with revenue analytics
- Manage rooms (CRUD operations)
- Manage bookings (view, update status, payment tracking)
- Manage users (view, edit, deactivate)
- Track revenue analytics
- View transactions separately from reservation fees
- Edit homepage content
- Upload and manage gallery images
- Manage vehicle rentals
- View and respond to contact messages

### Technical Features
- JWT authentication
- Real-time availability checking
- Calendar view with highlighted booked dates
- Pay on arrival (no online payment integration)
- Reviews and ratings system
- Image uploads with Cloudinary
- Responsive design with Tailwind CSS
- State management with Zustand
- Form handling with React Hook Form
- Date handling with date-fns
- Animations with Framer Motion
- UI components with shadcn/ui

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tumamak-lodge
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

5. Seed the database:
```bash
npm run seed
```

This creates:
- Admin user (email: admin@tumamaklodge.com, password: admin123)
- 16 sample rooms
- Homepage content

6. Start the backend server:
```bash
npm run dev
```

Server runs on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies (if not already installed):
```bash
npm install
```

3. Verify `.env` file exists:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the frontend development server:
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

### Admin Panel Setup

1. Navigate to the admin directory:
```bash
cd admin
```

2. Follow similar steps as frontend:
```bash
npm install
npm run dev
```

Admin panel runs on `http://localhost:5174`

## 📁 Backend Structure

```
backend/
├── config/              # Database and Cloudinary configuration
├── controllers/         # Route controllers
├── middleware/          # Auth, error, and upload middleware
├── models/             # Mongoose models
├── routes/             # API routes
├── scripts/            # Seed scripts
├── utils/              # Helper functions
├── server.js           # Entry point
└── package.json
```

## 📁 Frontend Structure

```
frontend/
├── src/
│   ├── components/     # Reusable components
│   │   ├── ui/        # shadcn/ui components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── ...
│   ├── pages/          # Page components
│   ├── store/          # Zustand stores
│   ├── lib/            # Utilities and axios config
│   ├── App.jsx         # Main app component
│   └── main.jsx        # Entry point
├── public/
└── package.json
```

## 🎨 Design System

### Colors (Light Brown Theme)
- Primary: Brown shades (50-900)
- Background: Light brown (#fdf8f6)
- No dark mode

### Components
- Built with Tailwind CSS
- Custom components using shadcn/ui
- Framer Motion for animations
- React Icons for icons

## 📝 API Endpoints

See `backend/README.md` for complete API documentation.

### Key Endpoints:
- **Auth**: `/api/auth/*`
- **Rooms**: `/api/rooms/*`
- **Bookings**: `/api/bookings/*`
- **Reviews**: `/api/reviews/*`
- **Vehicles**: `/api/vehicles/*`
- **Gallery**: `/api/gallery/*`
- **Analytics**: `/api/analytics/*`

## 🔐 User Roles

- **customer**: Regular users who can book rooms
- **staff**: Can manage bookings and rooms (optional)
- **admin**: Full access to all features

## 📱 Pages to Implement

### Frontend Pages (Already Created)
- ✅ HomePage
- ✅ RoomsPage (needs completion)
- ✅ RoomDetailPage (needs completion)
- ⏳ VehiclesPage
- ⏳ GalleryPage
- ⏳ ContactPage
- ⏳ LoginPage
- ⏳ RegisterPage
- ⏳ ProfilePage
- ⏳ BookingPage

### Admin Pages (To Be Created)
- Dashboard
- Rooms Management
- Bookings Management
- Users Management
- Revenue Analytics
- Gallery Management
- Homepage Content Editor
- Contact Messages

## 🛠️ Next Steps

1. **Complete Frontend Pages**: Create remaining page components (Login, Register, Rooms, etc.)
2. **Build Admin Panel**: Set up admin dashboard and management pages
3. **Add More UI Components**: Create modals, dropdowns, etc. from shadcn/ui
4. **Implement Image Upload**: Set up Cloudinary integration for profile and room images
5. **Add Form Validation**: Implement comprehensive form validation
6. **Test API Integration**: Ensure all API calls work correctly
7. **Optimize Performance**: Add loading states and error handling
8. **Deploy**: Set up production builds and deployment

## 📚 Libraries Used

### Backend
- Express.js - Web framework
- Mongoose - MongoDB ODM
- JWT - Authentication
- Bcrypt - Password hashing
- Multer - File uploads
- Cloudinary - Image storage
- Date-fns - Date manipulation

### Frontend
- React - UI library
- React Router DOM - Routing
- Zustand - State management
- Axios - HTTP client
- Tailwind CSS - Styling
- shadcn/ui - UI components
- Framer Motion - Animations
- React Hook Form - Form handling
- React DatePicker - Date selection
- React Icons - Icons
- Lucide React - Additional icons

## 🤝 Contributing

This is a custom project for Tumamak Lodge. For modifications or questions, contact the development team.

## 📄 License

ISC

---

Built with ❤️ for Tumamak Lodge
