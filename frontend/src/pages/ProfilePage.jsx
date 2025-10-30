import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useBookingStore } from '../store/bookingStore';
import { useReviewStore } from '../store/reviewStore';
import useVehicleRentalStore from '../store/vehicleRentalStore';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { formatCurrency, formatDate } from '../lib/utils';
import toast from 'react-hot-toast';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCamera,
  FaEdit,
  FaSave,
  FaTimes,
  FaCalendar,
  FaBed,
  FaUsers,
  FaStar,
  FaTrash,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaCar,
  FaMotorcycle,
  FaFileDownload,
  FaPrint,
  FaReceipt,
} from 'react-icons/fa';

const ProfilePage = () => {
  const location = useLocation();
  const { user, updateProfile, fetchUser } = useAuthStore();
  const { bookings, fetchMyBookings, cancelBooking, loading } = useBookingStore();
  const { rentals, fetchMyRentals, cancelRental, loading: rentalsLoading } = useVehicleRentalStore();
  const { createReview, loading: reviewLoading } = useReviewStore();

  const [activeTab, setActiveTab] = useState(location.state?.tab || 'profile');
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState(
    location.state?.message || ''
  );

  // Profile form state
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // Backend origin for serving images (strip trailing /api)
  const _apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const apiOrigin = _apiUrl.replace(/\/api\/?$/, '');

  const resolveImageSrc = (val) => {
    if (!val) return '/profile.jpg';
    const url = typeof val === 'string' ? val : val?.url || val;
    return url.startsWith('/images') ? `${apiOrigin}${url}` : url;
  };

  // Cancel booking modal state
  const [cancelModal, setCancelModal] = useState({
    isOpen: false,
    bookingId: null,
    reason: '',
  });

  // Review modal state
  const [reviewModal, setReviewModal] = useState({
    isOpen: false,
    bookingId: null,
    roomId: null,
    roomName: '',
    rating: 5,
    comment: '',
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
      });
      setImagePreview(user.profileImage || '/profile.jpg');
    }
  }, [user]);

  useEffect(() => {
    fetchMyBookings();
    fetchMyRentals();
  }, [fetchMyBookings, fetchMyRentals]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Itinerary functions
  const generateBookingItinerary = (booking) => {
    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Booking Itinerary - ${booking.bookingNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
            .header { text-align: center; margin-bottom: 40px; border-bottom: 3px solid #8B4513; padding-bottom: 20px; }
            .logo { font-size: 32px; font-weight: bold; color: #8B4513; margin-bottom: 10px; }
            .subtitle { color: #666; font-size: 14px; }
            .section { margin: 30px 0; }
            .section-title { font-size: 18px; font-weight: bold; color: #8B4513; margin-bottom: 15px; border-bottom: 2px solid #DEB887; padding-bottom: 5px; }
            .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
            .info-label { font-weight: bold; color: #666; }
            .info-value { color: #333; }
            .status { padding: 5px 15px; border-radius: 20px; display: inline-block; font-weight: bold; }
            .status-confirmed { background: #d4edda; color: #155724; }
            .status-pending { background: #fff3cd; color: #856404; }
            .status-checked-in { background: #d1ecf1; color: #0c5460; }
            .footer { margin-top: 50px; text-align: center; color: #666; font-size: 12px; }
            .total { font-size: 24px; font-weight: bold; color: #8B4513; text-align: right; margin-top: 20px; }
            @media print {
              body { padding: 20px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">Tumamak Lodge</div>
            <div class="subtitle">Booking Itinerary</div>
          </div>
          
          <div class="section">
            <div class="section-title">Booking Information</div>
            <div class="info-row">
              <span class="info-label">Booking Number:</span>
              <span class="info-value">${booking.bookingNumber}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Status:</span>
              <span class="status status-${booking.status}">${booking.status.toUpperCase()}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Booking Date:</span>
              <span class="info-value">${formatDate(booking.createdAt)}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Guest Information</div>
            <div class="info-row">
              <span class="info-label">Name:</span>
              <span class="info-value">${user?.firstName} ${user?.lastName}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Email:</span>
              <span class="info-value">${user?.email}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Phone:</span>
              <span class="info-value">${user?.phone || 'N/A'}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Room Details</div>
            <div class="info-row">
              <span class="info-label">Room:</span>
              <span class="info-value">${booking.room?.name}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Floor:</span>
              <span class="info-value">${booking.room?.floor}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Check-in:</span>
              <span class="info-value">${new Date(booking.checkInDate).toLocaleString()}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Check-out:</span>
              <span class="info-value">${new Date(booking.checkOutDate).toLocaleString()}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Guests:</span>
              <span class="info-value">${booking.guests?.adults} Adult${booking.guests?.adults > 1 ? 's' : ''}, ${booking.guests?.children || 0} Child${(booking.guests?.children || 0) !== 1 ? 'ren' : ''}</span>
            </div>
          </div>

          ${booking.specialRequests ? `
          <div class="section">
            <div class="section-title">Special Requests</div>
            <p>${booking.specialRequests}</p>
          </div>
          ` : ''}

          <div class="section">
            <div class="section-title">Payment Summary</div>
            <div class="info-row">
              <span class="info-label">Room Rate:</span>
              <span class="info-value">${formatCurrency(booking.totalAmount)}</span>
            </div>
            <div class="total">Total: ${formatCurrency(booking.totalAmount)}</div>
          </div>

          <div class="footer">
            <p>Thank you for choosing Tumamak Lodge!</p>
            <p>For inquiries, please contact us at info@tumamak-lodge.com</p>
            <p>Printed on ${new Date().toLocaleString()}</p>
          </div>
        </body>
      </html>
    `;
    return content;
  };

  const generateRentalItinerary = (rental) => {
    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Rental Itinerary - ${rental.rentalNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
            .header { text-align: center; margin-bottom: 40px; border-bottom: 3px solid #8B4513; padding-bottom: 20px; }
            .logo { font-size: 32px; font-weight: bold; color: #8B4513; margin-bottom: 10px; }
            .subtitle { color: #666; font-size: 14px; }
            .section { margin: 30px 0; }
            .section-title { font-size: 18px; font-weight: bold; color: #8B4513; margin-bottom: 15px; border-bottom: 2px solid #DEB887; padding-bottom: 5px; }
            .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
            .info-label { font-weight: bold; color: #666; }
            .info-value { color: #333; }
            .status { padding: 5px 15px; border-radius: 20px; display: inline-block; font-weight: bold; }
            .status-confirmed { background: #d4edda; color: #155724; }
            .status-pending { background: #fff3cd; color: #856404; }
            .status-active { background: #d1ecf1; color: #0c5460; }
            .status-completed { background: #e2e3e5; color: #383d41; }
            .footer { margin-top: 50px; text-align: center; color: #666; font-size: 12px; }
            .total { font-size: 24px; font-weight: bold; color: #8B4513; text-align: right; margin-top: 20px; }
            @media print {
              body { padding: 20px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">Tumamak Lodge</div>
            <div class="subtitle">Vehicle Rental Itinerary</div>
          </div>
          
          <div class="section">
            <div class="section-title">Rental Information</div>
            <div class="info-row">
              <span class="info-label">Rental Number:</span>
              <span class="info-value">${rental.rentalNumber}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Status:</span>
              <span class="status status-${rental.status}">${rental.status.toUpperCase()}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Booking Date:</span>
              <span class="info-value">${formatDate(rental.createdAt)}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Renter Information</div>
            <div class="info-row">
              <span class="info-label">Name:</span>
              <span class="info-value">${user?.firstName} ${user?.lastName}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Email:</span>
              <span class="info-value">${user?.email}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Phone:</span>
              <span class="info-value">${user?.phone || 'N/A'}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Vehicle Details</div>
            <div class="info-row">
              <span class="info-label">Vehicle:</span>
              <span class="info-value">${rental.vehicle?.name}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Type:</span>
              <span class="info-value">${rental.vehicle?.type}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Pickup Date:</span>
              <span class="info-value">${formatDate(rental.pickupDate)}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Return Date:</span>
              <span class="info-value">${formatDate(rental.returnDate)}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Duration:</span>
              <span class="info-value">${rental.rentalDays} ${rental.rentalDays === 1 ? 'day' : 'days'}</span>
            </div>
          </div>

          ${rental.specialRequests ? `
          <div class="section">
            <div class="section-title">Special Requests</div>
            <p>${rental.specialRequests}</p>
          </div>
          ` : ''}

          <div class="section">
            <div class="section-title">Payment Summary</div>
            <div class="info-row">
              <span class="info-label">Rental Fee:</span>
              <span class="info-value">${formatCurrency(rental.totalAmount - rental.securityDeposit)}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Security Deposit:</span>
              <span class="info-value">${formatCurrency(rental.securityDeposit)}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Payment Status:</span>
              <span class="info-value">${rental.paymentStatus === 'fully-paid' ? 'Fully Paid' : rental.paymentStatus === 'deposit-paid' ? 'Deposit Paid' : 'Unpaid'}</span>
            </div>
            <div class="total">Total: ${formatCurrency(rental.totalAmount)}</div>
          </div>

          <div class="footer">
            <p>Thank you for choosing Tumamak Lodge!</p>
            <p>For inquiries, please contact us at info@tumamak-lodge.com</p>
            <p>Printed on ${new Date().toLocaleString()}</p>
          </div>
        </body>
      </html>
    `;
    return content;
  };

  const printItinerary = (content) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const downloadPDF = (content, filename) => {
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Itinerary downloaded! Open with a browser and print to PDF.');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('firstName', profileData.firstName);
    formData.append('lastName', profileData.lastName);
    formData.append('email', profileData.email);
    if (profileData.phone) formData.append('phone', profileData.phone);
    if (profileImage) formData.append('profileImage', profileImage);

    const result = await updateProfile(formData);
    if (result.success) {
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
      setProfileImage(null);
      await fetchUser();
    } else {
      alert(result.error || 'Failed to update profile');
    }
  };

  const handleCancelBooking = async () => {
    const result = await cancelBooking(
      cancelModal.bookingId,
      cancelModal.reason
    );
    if (result.success) {
      setSuccessMessage('Booking cancelled successfully');
      setCancelModal({ isOpen: false, bookingId: null, reason: '' });
      await fetchMyBookings();
    } else {
      alert(result.error || 'Failed to cancel booking');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    const result = await createReview({
      room: reviewModal.roomId,
      booking: reviewModal.bookingId,
      rating: reviewModal.rating,
      comment: reviewModal.comment,
    });

    if (result.success) {
      setSuccessMessage('Review submitted successfully!');
      setReviewModal({
        isOpen: false,
        bookingId: null,
        roomId: null,
        roomName: '',
        rating: 5,
        comment: '',
      });
      await fetchMyBookings();
    } else {
      alert(result.error || 'Failed to submit review');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'checked-in':
        return 'text-blue-600 bg-blue-50';
      case 'checked-out':
        return 'text-gray-600 bg-gray-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-brown-600 bg-brown-50';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'text-green-600 bg-green-50';
      case 'partial':
        return 'text-yellow-600 bg-yellow-50';
      case 'pending':
        return 'text-orange-600 bg-orange-50';
      default:
        return 'text-brown-600 bg-brown-50';
    }
  };

  const canCancelBooking = (booking) => {
    return (
      booking.status === 'pending' ||
      booking.status === 'confirmed'
    );
  };

  const canLeaveReview = (booking) => {
    return booking.status === 'checked-out' && !booking.hasReview;
  };

  const upcomingBookings = bookings.filter(
    (b) =>
      (b.status === 'pending' || b.status === 'confirmed' || b.status === 'checked-in') &&
      new Date(b.checkOutDate) > new Date() // Check if checkout is in the future
  );

  const pastBookings = bookings.filter(
    (b) =>
      b.status === 'checked-out' ||
      b.status === 'cancelled' ||
      new Date(b.checkOutDate) < new Date() // Check if checkout has passed
  );

  return (
    <div className="min-h-screen bg-brown-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-brown-900 mb-2">My Profile</h1>
          <p className="text-brown-600 mb-8">
            Manage your account and view your bookings
          </p>

          {/* Success Message */}
          <AnimatePresence>
            {successMessage && (
              <Motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2"
              >
                <FaCheckCircle className="text-green-600" />
                <p className="text-green-700">{successMessage}</p>
                </Motion.div>
            )}
          </AnimatePresence>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-brown-200">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
                activeTab === 'profile'
                  ? 'text-brown-900 border-brown-600'
                  : 'text-brown-600 border-transparent hover:text-brown-800'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => {
                setActiveTab('bookings');
                fetchMyBookings(); // Refresh bookings when switching to this tab
              }}
              className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
                activeTab === 'bookings'
                  ? 'text-brown-900 border-brown-600'
                  : 'text-brown-600 border-transparent hover:text-brown-800'
              }`}
            >
              My Bookings
            </button>
            <button
              onClick={() => {
                setActiveTab('rentals');
                fetchMyRentals(); // Refresh rentals when switching to this tab
              }}
              className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
                activeTab === 'rentals'
                  ? 'text-brown-900 border-brown-600'
                  : 'text-brown-600 border-transparent hover:text-brown-800'
              }`}
            >
              Vehicle Rentals
            </button>
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Image Card */}
              <Card className="p-6 h-fit">
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-brown-200 flex items-center justify-center">
                      <img
                        src={imagePreview || user?.profileImage || '/profile.jpg'}
                        alt="Profile"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/profile.jpg';
                        }}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {isEditing && (
                      <label className="absolute bottom-0 right-0 bg-brown-600 text-white p-2 rounded-full cursor-pointer hover:bg-brown-700 transition-colors">
                        <FaCamera />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-brown-900">
                    {user?.firstName} {user?.lastName}
                  </h3>
                  <p className="text-brown-600 text-sm">{user?.email}</p>
                </div>
              </Card>

              {/* Profile Details Card */}
              <Card className="p-6 lg:col-span-2">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-brown-900">
                    Personal Information
                  </h2>
                  {!isEditing ? (
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="bg-brown-600 hover:bg-brown-700 text-white"
                    >
                      <FaEdit className="mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        setIsEditing(false);
                        setProfileData({
                          firstName: user?.firstName || '',
                          lastName: user?.lastName || '',
                          email: user?.email || '',
                          phone: user?.phone || '',
                        });
                        setImagePreview(user?.profileImage || '');
                        setProfileImage(null);
                      }}
                      variant="outline"
                      className="text-brown-600 border-brown-600 hover:bg-brown-50"
                    >
                      <FaTimes className="mr-2" />
                      Cancel
                    </Button>
                  )}
                </div>

                <form onSubmit={handleProfileUpdate}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            firstName: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            lastName: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            email: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            phone: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <div className="mt-6">
                      <Button
                        type="submit"
                        className="w-full bg-brown-600 hover:bg-brown-700 text-white"
                      >
                        <FaSave className="mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  )}
                </form>
              </Card>
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div className="space-y-8">
              {/* Debug Info - Remove after testing */}
              {import.meta.env.DEV && (
                <div className="p-4 bg-gray-100 rounded text-sm">
                  <p>Total bookings: {bookings.length}</p>
                  <p>Upcoming: {upcomingBookings.length}</p>
                  <p>Past: {pastBookings.length}</p>
                  <p>Loading: {loading ? 'Yes' : 'No'}</p>
                </div>
              )}

              {/* Loading State */}
              {loading && (
                <Card className="p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brown-600 mx-auto mb-4"></div>
                  <p className="text-brown-600">Loading bookings...</p>
                </Card>
              )}

              {/* Upcoming Bookings */}
              {!loading && (
                <div>
                  <h2 className="text-2xl font-bold text-brown-900 mb-4">
                    Upcoming Bookings ({upcomingBookings.length})
                  </h2>
                {upcomingBookings.length === 0 ? (
                  <Card className="p-8 text-center">
                    <FaCalendar className="text-5xl text-brown-300 mx-auto mb-4" />
                    <p className="text-brown-600">No upcoming bookings</p>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    {upcomingBookings.map((booking) => (
                      <Card key={booking._id} className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          {/* Room Image */}
                          <div className="md:w-48 h-48 rounded-lg overflow-hidden bg-brown-200 flex-shrink-0">
                            {booking.room?.images?.[0] ? (
                              <img
                                src={resolveImageSrc(booking.room?.images?.[0] || booking.room?.thumbnail)}
                                alt={booking.room.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <FaBed className="text-5xl text-brown-400" />
                              </div>
                            )}
                          </div>

                          {/* Booking Details */}
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-xl font-bold text-brown-900">
                                  {booking.room?.name}
                                </h3>
                                <p className="text-brown-600 text-sm">
                                  {booking.room?.floor}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <span
                                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                    booking.status
                                  )}`}
                                >
                                  {booking.status}
                                </span>
                                <span
                                  className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(
                                    booking.paymentStatus
                                  )}`}
                                >
                                  {booking.paymentStatus}
                                </span>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div className="flex items-center gap-2 text-brown-700">
                                <FaCalendar className="text-brown-600" />
                                <div>
                                  <p className="text-sm text-brown-600">
                                    Check-in
                                  </p>
                                  <p className="font-medium">
                                    {new Date(booking.checkInDate).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-brown-700">
                                <FaCalendar className="text-brown-600" />
                                <div>
                                  <p className="text-sm text-brown-600">
                                    Check-out
                                  </p>
                                  <p className="font-medium">
                                    {new Date(booking.checkOutDate).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-brown-700">
                                <FaUsers className="text-brown-600" />
                                <div>
                                  <p className="text-sm text-brown-600">Guests</p>
                                  <p className="font-medium">
                                    {booking.guests?.adults} Adult
                                    {booking.guests?.adults > 1 ? 's' : ''}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-brown-700">
                                <FaClock className="text-brown-600" />
                                <div>
                                  <p className="text-sm text-brown-600">
                                    Duration
                                  </p>
                                  <p className="font-medium">
                                    {booking.numberOfNights} period(s) (12h each)
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="pt-4 border-t border-brown-200">
                              <div className="flex justify-between items-center mb-3">
                                <div>
                                  <p className="text-sm text-brown-600">
                                    Total Amount
                                  </p>
                                  <p className="text-2xl font-bold text-brown-900">
                                    {formatCurrency(booking.totalAmount)}
                                  </p>
                                </div>
                                {canCancelBooking(booking) && (
                                  <Button
                                    onClick={() =>
                                      setCancelModal({
                                        isOpen: true,
                                        bookingId: booking._id,
                                        reason: '',
                                      })
                                    }
                                    variant="outline"
                                    className="text-red-600 border-red-600 hover:bg-red-50"
                                  >
                                    <FaTimesCircle className="mr-2" />
                                    Cancel Booking
                                  </Button>
                                )}
                              </div>
                              
                              {/* Itinerary Buttons */}
                              <div className="flex gap-2 mt-3">
                                <Button
                                  onClick={() => {
                                    const content = generateBookingItinerary(booking);
                                    printItinerary(content);
                                  }}
                                  variant="outline"
                                  size="sm"
                                  className="flex-1"
                                >
                                  <FaPrint className="mr-2" />
                                  Print Itinerary
                                </Button>
                                <Button
                                  onClick={() => {
                                    const content = generateBookingItinerary(booking);
                                    downloadPDF(content, `booking-${booking.bookingNumber}-itinerary.html`);
                                  }}
                                  variant="outline"
                                  size="sm"
                                  className="flex-1"
                                >
                                  <FaFileDownload className="mr-2" />
                                  Download PDF
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
              )}

              {/* Past Bookings */}
              {!loading && (
              <div>
                <h2 className="text-2xl font-bold text-brown-900 mb-4">
                  Past Bookings ({pastBookings.length})
                </h2>
                {pastBookings.length === 0 ? (
                  <Card className="p-8 text-center">
                    <FaCalendar className="text-5xl text-brown-300 mx-auto mb-4" />
                    <p className="text-brown-600">No past bookings</p>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    {pastBookings.map((booking) => (
                      <Card key={booking._id} className="p-6 opacity-90">
                        <div className="flex flex-col md:flex-row gap-6">
                          {/* Room Image */}
                          <div className="md:w-48 h-48 rounded-lg overflow-hidden bg-brown-200 flex-shrink-0">
                            {booking.room?.images?.[0] ? (
                              <img
                                src={resolveImageSrc(booking.room?.images?.[0] || booking.room?.thumbnail)}
                                alt={booking.room.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <FaBed className="text-5xl text-brown-400" />
                              </div>
                            )}
                          </div>

                          {/* Booking Details */}
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-xl font-bold text-brown-900">
                                  {booking.room?.name}
                                </h3>
                                <p className="text-brown-600 text-sm">
                                  {booking.room?.floor}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <span
                                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                    booking.status
                                  )}`}
                                >
                                  {booking.status}
                                </span>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div className="flex items-center gap-2 text-brown-700">
                                <FaCalendar className="text-brown-600" />
                                <div>
                                  <p className="text-sm text-brown-600">
                                    Check-in
                                  </p>
                                  <p className="font-medium">
                                    {new Date(booking.checkInDate).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-brown-700">
                                <FaCalendar className="text-brown-600" />
                                <div>
                                  <p className="text-sm text-brown-600">
                                    Check-out
                                  </p>
                                  <p className="font-medium">
                                    {new Date(booking.checkOutDate).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-brown-700">
                                <FaUsers className="text-brown-600" />
                                <div>
                                  <p className="text-sm text-brown-600">Guests</p>
                                  <p className="font-medium">
                                    {booking.guests?.adults} Adult
                                    {booking.guests?.adults > 1 ? 's' : ''}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-brown-700">
                                <p className="text-sm text-brown-600">
                                  Total Paid:
                                </p>
                                <p className="text-lg font-bold text-brown-900">
                                  {formatCurrency(booking.totalAmount)}
                                </p>
                              </div>
                            </div>

                            <div className="pt-4 border-t border-brown-200 space-y-3">
                              {canLeaveReview(booking) && (
                                <Button
                                  onClick={() =>
                                    setReviewModal({
                                      isOpen: true,
                                      bookingId: booking._id,
                                      roomId: booking.room._id,
                                      roomName: booking.room.name,
                                      rating: 5,
                                      comment: '',
                                    })
                                  }
                                  className="bg-brown-600 hover:bg-brown-700 text-white w-full"
                                >
                                  <FaStar className="mr-2" />
                                  Leave a Review
                                </Button>
                              )}
                              
                              {/* Itinerary Buttons */}
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => {
                                    const content = generateBookingItinerary(booking);
                                    printItinerary(content);
                                  }}
                                  variant="outline"
                                  size="sm"
                                  className="flex-1"
                                >
                                  <FaPrint className="mr-2" />
                                  Print Itinerary
                                </Button>
                                <Button
                                  onClick={() => {
                                    const content = generateBookingItinerary(booking);
                                    downloadPDF(content, `booking-${booking.bookingNumber}-itinerary.html`);
                                  }}
                                  variant="outline"
                                  size="sm"
                                  className="flex-1"
                                >
                                  <FaFileDownload className="mr-2" />
                                  Download PDF
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
              )}
              </div>
            )}
          </Motion.div>
      </div>

      {/* Cancel Booking Modal */}
      <AnimatePresence>
        {cancelModal.isOpen && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() =>
              setCancelModal({ isOpen: false, bookingId: null, reason: '' })
            }
          >
            <Motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-brown-900 mb-4">
                Cancel Booking
              </h3>
              <p className="text-brown-600 mb-4">
                Are you sure you want to cancel this booking? This action cannot
                be undone.
              </p>
              <div className="mb-4">
                <Label htmlFor="cancelReason">
                  Reason for cancellation (optional)
                </Label>
                <Textarea
                  id="cancelReason"
                  value={cancelModal.reason}
                  onChange={(e) =>
                    setCancelModal({ ...cancelModal, reason: e.target.value })
                  }
                  placeholder="Let us know why you're cancelling..."
                  className="mt-1 min-h-[100px]"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() =>
                    setCancelModal({ isOpen: false, bookingId: null, reason: '' })
                  }
                  variant="outline"
                  className="flex-1"
                >
                  Keep Booking
                </Button>
                <Button
                  onClick={handleCancelBooking}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  Yes, Cancel
                </Button>
              </div>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>

      {/* Review Modal */}
      <AnimatePresence>
        {reviewModal.isOpen && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() =>
              setReviewModal({
                isOpen: false,
                bookingId: null,
                roomId: null,
                roomName: '',
                rating: 5,
                comment: '',
              })
            }
          >
            <Motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-brown-900 mb-2">
                Leave a Review
              </h3>
              <p className="text-brown-600 mb-4">
                How was your stay at {reviewModal.roomName}?
              </p>
              <form onSubmit={handleSubmitReview}>
                <div className="mb-4">
                  <Label htmlFor="rating">Rating</Label>
                  <div className="flex gap-2 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() =>
                          setReviewModal({ ...reviewModal, rating: star })
                        }
                        className="text-3xl transition-colors"
                      >
                        <FaStar
                          className={
                            star <= reviewModal.rating
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <Label htmlFor="comment">Your Review</Label>
                  <Textarea
                    id="comment"
                    value={reviewModal.comment}
                    onChange={(e) =>
                      setReviewModal({ ...reviewModal, comment: e.target.value })
                    }
                    placeholder="Share your experience..."
                    className="mt-1 min-h-[120px]"
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={() =>
                      setReviewModal({
                        isOpen: false,
                        bookingId: null,
                        roomId: null,
                        roomName: '',
                        rating: 5,
                        comment: '',
                      })
                    }
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-brown-600 hover:bg-brown-700 text-white"
                    disabled={reviewLoading}
                  >
                    {reviewLoading ? 'Submitting...' : 'Submit Review'}
                  </Button>
                </div>
              </form>
            </Motion.div>
          </Motion.div>
        )}

        {/* Vehicle Rentals Tab */}
        {activeTab === 'rentals' && (
          <div>
            <h2 className="text-2xl font-bold text-brown-900 mb-6">
              My Vehicle Rentals
            </h2>

            {rentalsLoading && (
              <div className="text-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-brown-600 border-r-transparent"></div>
                <p className="mt-4 text-brown-700">Loading rentals...</p>
              </div>
            )}

            {!rentalsLoading && rentals && rentals.length === 0 && (
              <Card className="p-12 text-center">
                <FaCar className="text-6xl text-brown-300 mx-auto mb-4" />
                <p className="text-brown-600 text-lg mb-4">
                  You haven't rented any vehicles yet
                </p>
                <Button
                  onClick={() => (window.location.href = '/vehicles')}
                  className="bg-brown-600 hover:bg-brown-700 text-white"
                >
                  Browse Vehicles
                </Button>
              </Card>
            )}

            {!rentalsLoading && rentals && rentals.length > 0 && (
              <div className="space-y-6">
                {rentals.map((rental) => (
                  <Card key={rental._id} className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Vehicle Image */}
                      <div className="md:w-48 h-48 flex-shrink-0">
                        {rental.vehicle?.images && rental.vehicle.images.length > 0 ? (
                          <img
                            src={rental.vehicle.images[0].url}
                            alt={rental.vehicle.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-full bg-brown-100 rounded-lg flex items-center justify-center">
                            {rental.vehicle?.type === 'Motorcycle' ? (
                              <FaMotorcycle className="text-6xl text-brown-400" />
                            ) : (
                              <FaCar className="text-6xl text-brown-400" />
                            )}
                          </div>
                        )}
                      </div>

                      {/* Rental Details */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-brown-900">
                              {rental.vehicle?.name || 'Vehicle'}
                            </h3>
                            <p className="text-brown-600">
                              {rental.vehicle?.type} • Rental #{rental.rentalNumber}
                            </p>
                          </div>
                          <div className="text-right">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                rental.status === 'confirmed'
                                  ? 'bg-green-100 text-green-800'
                                  : rental.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : rental.status === 'active'
                                  ? 'bg-blue-100 text-blue-800'
                                  : rental.status === 'completed'
                                  ? 'bg-gray-100 text-gray-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-brown-700">
                            <FaCalendar className="text-brown-500" />
                            <div>
                              <p className="text-sm text-brown-600">Pickup</p>
                              <p className="font-semibold">
                                {formatDate(rental.pickupDate)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-brown-700">
                            <FaCalendar className="text-brown-500" />
                            <div>
                              <p className="text-sm text-brown-600">Return</p>
                              <p className="font-semibold">
                                {formatDate(rental.returnDate)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-brown-700">
                            <FaClock className="text-brown-500" />
                            <div>
                              <p className="text-sm text-brown-600">Duration</p>
                              <p className="font-semibold">
                                {rental.rentalDays} {rental.rentalDays === 1 ? 'day' : 'days'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-brown-700">
                            <div>
                              <p className="text-sm text-brown-600">Payment Status</p>
                              <p className={`font-semibold ${
                                rental.paymentStatus === 'fully-paid' 
                                  ? 'text-green-600' 
                                  : rental.paymentStatus === 'deposit-paid'
                                  ? 'text-yellow-600'
                                  : 'text-red-600'
                              }`}>
                                {rental.paymentStatus === 'fully-paid' 
                                  ? 'Fully Paid' 
                                  : rental.paymentStatus === 'deposit-paid'
                                  ? 'Deposit Paid'
                                  : rental.paymentStatus === 'refunded'
                                  ? 'Refunded'
                                  : 'Unpaid'}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-brown-200 pt-4 mt-4">
                          <div className="flex justify-between items-center mb-3">
                            <div>
                              <p className="text-sm text-brown-600">Total Amount</p>
                              <p className="text-2xl font-bold text-brown-900">
                                {formatCurrency(rental.totalAmount)}
                              </p>
                              <p className="text-xs text-brown-500">
                                Includes ₱{rental.securityDeposit?.toLocaleString()} security deposit
                              </p>
                            </div>
                            {rental.status === 'pending' && (
                              <Button
                                variant="outline"
                                className="text-red-600 border-red-600 hover:bg-red-50"
                                onClick={async () => {
                                  if (window.confirm('Are you sure you want to cancel this rental?')) {
                                    const result = await cancelRental(rental._id);
                                    if (result.success) {
                                      toast.success('Rental cancelled successfully');
                                    } else {
                                      toast.error(result.error || 'Failed to cancel rental');
                                    }
                                  }
                                }}
                                disabled={rentalsLoading}
                              >
                                {rentalsLoading ? 'Cancelling...' : 'Cancel Rental'}
                              </Button>
                            )}
                          </div>

                          {/* Itinerary Buttons */}
                          <div className="flex gap-2">
                            <Button
                              onClick={() => {
                                const content = generateRentalItinerary(rental);
                                printItinerary(content);
                              }}
                              variant="outline"
                              size="sm"
                              className="flex-1"
                            >
                              <FaPrint className="mr-2" />
                              Print Itinerary
                            </Button>
                            <Button
                              onClick={() => {
                                const content = generateRentalItinerary(rental);
                                downloadPDF(content, `rental-${rental.rentalNumber}-itinerary.html`);
                              }}
                              variant="outline"
                              size="sm"
                              className="flex-1"
                            >
                              <FaFileDownload className="mr-2" />
                              Download PDF
                            </Button>
                          </div>
                        </div>

                        {rental.specialRequests && (
                          <div className="mt-4 p-3 bg-brown-50 rounded">
                            <p className="text-sm text-brown-600 font-semibold">Special Requests:</p>
                            <p className="text-sm text-brown-700">{rental.specialRequests}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfilePage;
