# Tumamak Lodge - Admin Panel# React + Vite



Admin dashboard for managing the Tumamak Lodge booking system.This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.



## ✅ What's Been ImplementedCurrently, two official plugins are available:



### Core Features- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh

- ✅ **Authentication System**- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

  - Login page with admin role verification

  - Protected routes with automatic redirect## React Compiler

  - JWT token management

  - Logout functionalityThe React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).



- ✅ **Dashboard** (`/`)## Expanding the ESLint configuration

  - Revenue analytics with charts (recharts)

  - Quick stats cards (Total Revenue, Bookings, Users, Occupancy Rate)If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

  - Revenue trend line chart (last 30 days)
  - Booking status distribution pie chart
  - Revenue by room type bar chart
  - Recent bookings table with status badges

- ✅ **Rooms Management** (`/rooms`)
  - View all rooms in a table
  - Add new room with complete form
  - Edit room details (inline dialog)
  - Delete rooms with confirmation
  - Upload multiple room images
  - Delete individual room images
  - Toggle room availability
  - Real-time image management

### UI Components
All components built with Tailwind CSS and brown theme:
- Button (multiple variants)
- Card (with header, content, footer)
- Input & Label
- Textarea
- Select dropdown
- Table (with header, body, rows, cells)
- Dialog (modal)
- Badge (status indicators)
- Alert (error/success messages)

## 🚀 Getting Started

### Default Admin Credentials
Use these credentials to login (created by backend seed script):
- **Email**: `admin@tumamaklodge.com`
- **Password**: `admin123`

### Start the Admin Panel
```bash
npm run dev
```

The admin panel will run on `http://localhost:5175` (or next available port).

### Prerequisites
- Backend server running on `http://localhost:5000`
- MongoDB running
- Backend seed script executed

## 📊 Dashboard Features

### Quick Stats Cards
- **Total Revenue**: Shows total revenue with growth percentage
- **Total Bookings**: Total bookings with active count
- **Total Users**: Registered users with new users this month
- **Occupancy Rate**: Room occupancy percentage

### Charts (Recharts)
1. **Revenue Trend** - Line chart showing last 30 days
2. **Booking Status Distribution** - Pie chart with percentages
3. **Revenue by Room Type** - Bar chart comparison

### Recent Bookings Table
Displays last 10 bookings with status badges and payment info.

## 🏨 Rooms Management

### Features
- **View All Rooms** in table format
- **Add Room** with complete form
- **Edit Room** details
- **Delete Room** with confirmation
- **Upload Images** (multiple at once)
- **Delete Images** individually
- **Toggle Availability**

### Room Form Fields
- Name, Type (Standard/Deluxe/Suite/Family)
- Description
- Price per night
- Max capacity
- Room size & bed type (Single/Double/Queen/King)
- Amenities (comma-separated)
- Availability toggle

## 🎨 Design System

### Color Theme (Light Brown)
```javascript
brown: {
  50: '#fdf8f6',   // Background
  600: '#a18072',  // Primary buttons
  700: '#977669',  // Dark text
  900: '#43302b',  // Headings
}
```

## 📱 Navigation

### Sidebar Menu
- ✅ Dashboard (/)
- ✅ Rooms (/rooms)
- 🔜 Bookings (/bookings)
- 🔜 Vehicle Rentals (/vehicle-rentals)
- 🔜 Users (/users)
- 🔜 Revenue Analytics (/revenue)
- 🔜 Gallery (/gallery)
- 🔜 Homepage Editor (/homepage)
- 🔜 Contact Messages (/contacts)

## 🛠️ Technical Stack

- **React 19.1.1** - UI library
- **React Router DOM 7.9.4** - Routing
- **Zustand 5.0.8** - State management
- **Tailwind CSS 4.1.14** - Styling
- **Recharts 3.2.1** - Charts
- **Axios 1.12.2** - HTTP client
- **Lucide React** - Icons
- **Vite** - Build tool

## 🐛 Troubleshooting

### Login Issues
- Ensure backend is running
- Use exact credentials: `admin@tumamaklodge.com` / `admin123`
- Check backend seed script was run

### Charts Not Displaying
- Dashboard needs data from backend API
- Create some bookings in frontend first

### Image Upload Fails
- Verify Cloudinary credentials in backend `.env`
- Check file size (max 5MB)

## 📋 Next Steps

### Priority 1
1. Bookings Management page
2. Vehicle Rentals Management
3. Users Management

### Priority 2
4. Revenue Analytics page
5. Gallery Management
6. Homepage Editor
7. Contact Messages

---

**Built with ❤️ for Tumamak Lodge**
