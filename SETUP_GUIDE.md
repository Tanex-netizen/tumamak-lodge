# Tumamak Lodge - Complete Setup Guide

## 🎯 Project Overview

This is a complete full-stack lodge booking website with:
- **Backend**: Node.js + Express API with MongoDB
- **Frontend**: React customer-facing app with Tailwind CSS + shadcn/ui
- **Admin Panel**: React admin dashboard

## 📋 What Has Been Created

### ✅ Backend (Complete)
- All models (User, Room, Booking, Review, Vehicle, Gallery, Homepage, Contact)
- All controllers with full CRUD operations
- All routes with proper authentication and authorization
- JWT authentication system
- Image upload with Cloudinary
- Analytics and revenue tracking
- Seed script for initial data
- Complete API documentation

### ✅ Frontend (80% Complete)
- Project structure and configuration
- Tailwind CSS with light brown theme
- Zustand stores (auth, room, booking)
- UI components (Button, Card, Input, Label, Textarea)
- Navbar with profile image display
- Footer
- HomePage with hero section and featured rooms
- Login and Register pages
- RoomsPage
- Placeholder pages for remaining features
- Responsive design
- Animation setup with Framer Motion

### ⏳ Admin Panel (20% Complete)
- Project initialized
- Dependencies installed
- Ready for implementation

## 🚀 Getting Started

### Step 1: Start MongoDB

Make sure MongoDB is running on your system:

```bash
# If using local MongoDB
sudo systemctl start mongodb
# or
mongod

# If using MongoDB Atlas, update the MONGODB_URI in backend/.env
```

### Step 2: Setup and Start Backend

```bash
cd backend

# Create .env file from example
cp .env.example .env

# Edit .env and add your credentials:
# - MongoDB URI
# - JWT Secret (any random string)
# - Cloudinary credentials (sign up at cloudinary.com)

# Install dependencies (if not already done)
npm install

# Seed the database with initial data
npm run seed

# Start the backend server
npm run dev
```

The backend will run on `http://localhost:5000`

**Default Admin Credentials** (created by seed script):
- Email: `admin@tumamaklodge.com`
- Password: `admin123`

### Step 3: Start Frontend

Open a new terminal:

```bash
cd frontend

# Dependencies are already installed
# Start the development server
npm run dev
```

The frontend will run on `http://localhost:5173`

### Step 4: Test the Application

1. Open `http://localhost:5173` in your browser
2. You should see the homepage with hero section
3. Click "Register" to create a new account
4. Or login with admin credentials above
5. Browse rooms and test functionality

## 📝 Next Steps - What You Need to Complete

### Priority 1: Frontend Pages (High Priority)

1. **RoomDetailPage** (`frontend/src/pages/RoomDetailPage.jsx`)
   - Display full room details
   - Show image gallery (slideshow)
   - Display amenities
   - Show reviews and ratings
   - Add "Book Now" button
   - Show calendar with booked dates highlighted

2. **BookingPage** (`frontend/src/pages/BookingPage.jsx`)
   - Date selection with calendar
   - Guest count selection
   - Display booking summary
   - Show total price calculation
   - Handle reservation fee vs full payment
   - Create booking API call

3. **ProfilePage** (`frontend/src/pages/ProfilePage.jsx`)
   - Display user information
   - Profile image upload
   - Edit profile form
   - View booking history with itinerary
   - Cancel booking functionality
   - Leave reviews for past bookings

4. **ContactPage** (`frontend/src/pages/ContactPage.jsx`)
   - Contact form
   - Display contact information
   - Map integration (optional)

5. **VehiclesPage** (`frontend/src/pages/VehiclesPage.jsx`)
   - Display available vehicles
   - Vehicle cards with images
   - Filter by type
   - Show rental prices

6. **GalleryPage** (`frontend/src/pages/GalleryPage.jsx`)
   - Display gallery images
   - Image grid layout
   - Lightbox for full-size viewing
   - Filter by category

### Priority 2: Admin Panel (High Priority)

Create the admin panel in the `/admin` folder:

1. **Dashboard** (`admin/src/pages/Dashboard.jsx`)
   - Revenue analytics with charts (use recharts)
   - Booking statistics
   - Recent bookings table
   - Quick stats cards

2. **Rooms Management** (`admin/src/pages/RoomsManagement.jsx`)
   - List all rooms in a table
   - Add new room form
   - Edit room details
   - Upload room images
   - Delete rooms
   - Toggle availability

3. **Bookings Management** (`admin/src/pages/BookingsManagement.jsx`)
   - View all bookings
   - Filter by status, date range
   - Update booking status (pending → confirmed → checked-in → checked-out)
   - Update payment status
   - View booking details

4. **Walk-in Bookings** (`admin/src/pages/WalkInBookings.jsx`) ✅ COMPLETED
   - View all 16 rooms in a grid
   - Select a room to book
   - Calendar shows booked dates with red '/' slash
   - Create walk-in booking without adding to revenue
   - Guest information capture (name, phone)
   - Payment handled at front desk
   - Fully mobile responsive

5. **Users Management** (`admin/src/pages/UsersManagement.jsx`) ✅ COMPLETED
   - List all users
   - View user details
   - Edit user roles
   - Deactivate/activate users
   - Filter by role and status

6. **Contact Messages** (`admin/src/pages/ContactMessages.jsx`) ✅ COMPLETED
   - **Conversation-based chat interface** (WhatsApp/Messenger style)
   - Two-column layout: conversation list + message thread
   - View all customer conversations with message bubbles
   - Mark messages as read/unread automatically
   - Send real-time responses to customers
   - Update conversation status (active/closed)
   - Delete conversations
   - Filter by status (active/closed)
   - Real-time polling (updates every 5 seconds)
   - Unread conversation count badge
   - Message timestamps and date separators
   - **Customer messages:** Left-aligned, white background
   - **Admin messages:** Right-aligned, brown background with sender name

**Floating Chat Widget** (`frontend/src/components/FloatingChat.jsx`) ✅ COMPLETED
   - **Conversation thread view** for logged-in users
   - Floating chat button on all public pages
   - **Red notification dot with animation** when admin sends new message
   - Message bubbles with timestamps
   - Auto-scroll to latest message
   - Real-time polling for new admin responses (every 5 seconds)
   - Date separators (Today, Yesterday, etc.)
   - Keyboard shortcuts (Enter to send, Shift+Enter for new line)
   - Login required to start conversations
   - **Customer's own messages:** Right-aligned, brown background
   - **Admin responses:** Left-aligned, white background with admin name

7. **Revenue Analytics** (`admin/src/pages/RevenueAnalytics.jsx`)
   - Charts showing revenue over time
   - Revenue by room
   - Separate view for reservation fees vs full payments
   - Export data functionality

6. **Gallery Management** (`admin/src/pages/GalleryManagement.jsx`)
   - Upload new images
   - Edit image details (title, category)
   - Delete images
   - View all gallery images

7. **Homepage Editor** (`admin/src/pages/HomepageEditor.jsx`)
   - Edit hero section content
   - Edit about section
   - Update contact information

### Priority 3: Enhancements

1. **Add More UI Components**
   - Dialog/Modal
   - Select dropdown
   - Tabs
   - Badge
   - Alert
   - Skeleton loaders

2. **Improve User Experience**
   - Add loading states everywhere
   - Better error handling and messages
   - Toast notifications for success/error
   - Form validation with better error messages
   - Image upload preview

3. **Mobile Optimization**
   - Test all pages on mobile
   - Improve mobile navigation
   - Optimize images for mobile

4. **Additional Features**
   - Email notifications (using nodemailer)
   - Booking confirmation emails
   - Password reset functionality
   - Search and filter improvements
   - Pagination for large lists

## 🎨 Design Guidelines

### Color Scheme (Light Brown Theme)
```javascript
brown: {
  50: '#fdf8f6',   // Background
  100: '#f2e8e5',  // Light elements
  200: '#eaddd7',  // Borders
  300: '#e0cec7',
  400: '#d2bab0',
  500: '#bfa094',
  600: '#a18072',  // Primary buttons
  700: '#977669',  // Dark text
  800: '#846358',
  900: '#43302b',  // Headings
}
```

### Component Guidelines
- Use shadcn/ui components for consistency
- Add Framer Motion animations for smooth transitions
- Maintain mobile-first responsive design
- Keep brown theme throughout (no dark mode)

## 📚 Key Files Reference

### Backend Structure
```
backend/
├── config/
│   ├── db.js                    # MongoDB connection
│   └── cloudinary.js            # Cloudinary config
├── models/                      # All Mongoose models
├── controllers/                 # All route controllers
├── routes/                      # All API routes
├── middleware/
│   ├── authMiddleware.js       # JWT authentication
│   ├── errorMiddleware.js      # Error handling
│   └── uploadMiddleware.js     # File upload
└── server.js                    # Entry point
```

### Frontend Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── RoomCard.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/                   # All page components
│   ├── store/
│   │   ├── authStore.js        # Auth state
│   │   ├── roomStore.js        # Rooms state
│   │   └── bookingStore.js     # Bookings state
│   ├── lib/
│   │   ├── axios.js            # Axios instance
│   │   └── utils.js            # Helper functions
│   └── App.jsx                  # Main app
```

## 🔧 Common Tasks

### Adding a New Page

1. Create page component in `src/pages/`
2. Add route in `App.jsx`
3. Add navigation link in `Navbar.jsx` (if needed)

### Adding a New API Endpoint

1. Add method in controller file
2. Add route in routes file
3. Test with Postman or frontend

### Adding a New Zustand Store

1. Create store file in `src/store/`
2. Import and use in components with `useStoreName()`

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Error**
- Check if MongoDB is running
- Verify MONGODB_URI in .env

**JWT Error**
- Make sure JWT_SECRET is set in .env
- Check if token is being sent in headers

**Image Upload Error**
- Verify Cloudinary credentials in .env
- Check file size limits (5MB max)

### Frontend Issues

**API Connection Error**
- Ensure backend is running on port 5000
- Check VITE_API_URL in frontend/.env

**Routing Issues**
- Make sure React Router is properly configured
- Check for missing imports

**Style Not Loading**
- Run `npm install` to ensure Tailwind is installed
- Check if `index.css` is imported in `main.jsx`

## 📞 Support

For questions or issues:
1. Check the README files in each folder
2. Review the API documentation in `backend/README.md`
3. Check the comprehensive main README.md

## ✅ Testing Checklist

Before deployment, test:

- [ ] User registration and login
- [ ] Room browsing and filtering
- [ ] Room booking with date selection
- [ ] Payment status tracking
- [ ] Profile management with image upload
- [ ] Booking history and itinerary view
- [ ] Review and rating system
- [ ] Admin dashboard analytics
- [ ] Admin CRUD operations for all entities
- [ ] Mobile responsiveness
- [ ] Image uploads (rooms, gallery, profile)
- [ ] Email notifications (if implemented)

## 🚀 Deployment (Future)

When ready to deploy:

1. **Backend**
   - Deploy to Heroku, Railway, or DigitalOcean
   - Use MongoDB Atlas for database
   - Set environment variables

2. **Frontend & Admin**
   - Build: `npm run build`
   - Deploy to Vercel, Netlify, or similar
   - Update API URL to production backend

---

**Happy Coding! 🎉**

Built with ❤️ for Tumamak Lodge
