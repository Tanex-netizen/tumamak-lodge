import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import ProtectedRoute from './components/ProtectedRoute';
import AdminNavbar from './components/AdminNavbar';
import AdminSidebar from './components/AdminSidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RoomsManagement from './pages/RoomsManagement';
import BookingsManagement from './pages/BookingsManagement';
import WalkInBookings from './pages/WalkInBookings';
import UsersManagement from './pages/UsersManagement';
import RevenueAnalytics from './pages/RevenueAnalytics';
import VehicleRentalsManagement from './pages/VehicleRentalsManagement';
import ContactMessages from './pages/ContactMessages';

function App() {
  const user = useAuthStore((state) => state.user);

  // If not logged in, show login page
  if (!user || user.role !== 'admin') {
    return (
      <>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </>
    );
  }

  // If logged in as admin, show admin panel
  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-brown-50">
        <AdminNavbar />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 p-8">
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/rooms"
                element={
                  <ProtectedRoute>
                    <RoomsManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/bookings"
                element={
                  <ProtectedRoute>
                    <BookingsManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/walk-in"
                element={
                  <ProtectedRoute>
                    <WalkInBookings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/vehicle-rentals"
                element={
                  <ProtectedRoute>
                    <VehicleRentalsManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users"
                element={
                  <ProtectedRoute>
                    <UsersManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/revenue"
                element={
                  <ProtectedRoute>
                    <RevenueAnalytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/contacts"
                element={
                  <ProtectedRoute>
                    <ContactMessages />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </>
  );
}

export default App;
