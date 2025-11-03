import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRoomStore } from '../store/roomStore';
import { useAuthStore } from '../store/authStore';
import { motion as Motion } from 'framer-motion';
import { FaUsers, FaStar, FaChevronLeft, FaChevronRight, FaWifi, FaTv, FaSnowflake, FaCoffee, FaPlug, FaBath, FaBoxOpen, FaMountain } from 'react-icons/fa';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, addDays } from 'date-fns';
import { formatCurrency } from '../lib/utils';

const RoomDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedRoom, loading, fetchRoomById, bookedDates, fetchBookedDates } = useRoomStore();
  const { isAuthenticated } = useAuthStore();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);

  useEffect(() => {
    if (id) {
      fetchRoomById(id);
      fetchBookedDates(id);
    }
  }, [fetchBookedDates, fetchRoomById, id]);

  // Compute images and helpers early so Hooks below are always called
  const images = selectedRoom?.images || [];
  const hasImages = images.length > 0;
  const roomPrice = selectedRoom?.price || 0;

  // Filter to show only base images (without (2), (3), etc.) as thumbnails
  const thumbnailImages = images.filter(img => !img.url.includes('('));

  // Resolve image URL to backend origin when stored as server-relative path.
  const resolveImageSrc = (url) => {
    if (!url) return null;
    const api = import.meta.env.VITE_API_URL;
    const origin = api ? api.replace(/\/api\/?$/, '') : '';
    return url.startsWith('/images') ? `${origin}${url}` : url;
  };

  const nextImage = () => {
    if (hasImages) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (hasImages) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  // Reset the image index when the selected room changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [selectedRoom]);

  // Auto-advance the slideshow every 5 seconds when images are present.
  useEffect(() => {
    if (!hasImages) return undefined;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000); // 5s per slide

    return () => clearInterval(interval);
  }, [hasImages, images.length]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brown-50 flex items-center justify-center">
        <p className="text-brown-600 text-lg">Loading room details...</p>
      </div>
    );
  }

  if (!selectedRoom) {
    return (
      <div className="min-h-screen bg-brown-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-brown-600 text-lg mb-4">Room not found</p>
          <Button onClick={() => navigate('/rooms')}>Back to Rooms</Button>
        </div>
      </div>
    );
  }

  // Log for debugging (use optional chaining to avoid errors when selectedRoom is null)
  console.log('Selected Room:', selectedRoom);
  console.log('Room Price:', selectedRoom?.price);
  // (hooks for resetting index and auto-advance are declared earlier to ensure hooks
  // run in the same order on every render and avoid conditional hook invocation)

  // Parse booked dates for calendar highlighting
  // bookedDates is now an array of date strings like ["2025-10-18", "2025-10-19"]
  const excludedDates = bookedDates.map((dateStr) => {
    const parsed = new Date(dateStr);
    return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
  });

  // Check if a date is booked
  const isDateBooked = (date) => {
    if (!date) return false;
    return excludedDates.some(
      bookedDate => 
        bookedDate.getFullYear() === date.getFullYear() &&
        bookedDate.getMonth() === date.getMonth() &&
        bookedDate.getDate() === date.getDate()
    );
  };

  // Custom day renderer to show red slash on booked dates
  const renderDayContents = (day, date) => {
    if (!date) return day;
    const isBooked = isDateBooked(date);
    
    return (
      <div className="relative inline-block" style={{ width: '100%', height: '100%', position: 'relative' }}>
        <span className={isBooked ? 'text-gray-400' : 'text-gray-900'}>{day}</span>
        {isBooked && (
          <span 
            className="absolute text-red-600 font-bold pointer-events-none"
            style={{ 
              fontSize: '32px',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              lineHeight: '1',
              zIndex: 10
            }}
          >
            /
          </span>
        )}
      </div>
    );
  };

  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/rooms/${id}` } });
      return;
    }

    if (!checkIn || !checkOut) {
      alert('Please select check-in and check-out dates');
      return;
    }

    navigate('/booking', {
      state: {
        room: selectedRoom,
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
      },
    });
  };

  // Map known amenity labels (normalized to lowercase) to icon components.
  // This covers the amenity names created by the seed script (e.g. "Free WiFi", "Mini Fridge", "Flat-screen TV", etc.).
  const amenityIcons = {
    'free wifi': FaWifi,
    'wifi': FaWifi,
    'flat-screen tv': FaTv,
    'flat screen tv': FaTv,
    'tv': FaTv,
    'air conditioning': FaSnowflake,
    'coffee maker': FaCoffee,
    'fan': FaSnowflake,
    'generator': FaPlug,
    'private bathroom': FaBath,
    'mini fridge': FaBoxOpen,
    'mini-fridge': FaBoxOpen,
    'balcony': FaMountain,
    'mountain view': FaMountain,
  };

  return (
    <div className="min-h-screen bg-brown-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => navigate('/rooms')}
          className="mb-6"
        >
          <FaChevronLeft className="mr-2" /> Back to Rooms
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Slider */}
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              <Card className="overflow-hidden">
                <div className="relative h-96 bg-brown-200">
                  {hasImages ? (
                    <>
                      <img
                        src={resolveImageSrc(images[currentImageIndex]?.url) || '/header.jpg'}
                        alt={`${selectedRoom.name} - Image ${currentImageIndex + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {images.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition"
                          >
                            <FaChevronLeft className="text-brown-800" />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition"
                          >
                            <FaChevronRight className="text-brown-800" />
                          </button>
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                            {thumbnailImages.map((image, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentImageIndex(images.findIndex(img => img.url === image.url))}
                                className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition ${
                                  images.findIndex(img => img.url === image.url) === currentImageIndex ? 'border-white' : 'border-white/50'
                                }`}
                              >
                                <img
                                  src={resolveImageSrc(image?.url) || '/header.jpg'}
                                  alt={`Thumbnail ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <p className="text-brown-400">No image available</p>
                    </div>
                  )}
                </div>
              </Card>

              {/* Thumbnail Gallery Below Main Image */}
              {thumbnailImages.length > 1 && (
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  {thumbnailImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(images.findIndex(img => img.url === image.url))}
                      className={`w-20 h-16 rounded-lg overflow-hidden border-2 transition hover:scale-105 ${
                        images.findIndex(img => img.url === image.url) === currentImageIndex ? 'border-brown-600' : 'border-brown-300'
                      }`}
                    >
                      <img
                        src={resolveImageSrc(image?.url) || '/header.jpg'}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </Motion.div>

            {/* Room Info */}
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-brown-900 mb-2">{selectedRoom.name}</h1>
                    <p className="text-brown-600">
                      Room {selectedRoom.roomNumber} • {selectedRoom.floor}
                    </p>
                  </div>
                  <div className="text-right bg-brown-100 px-4 py-3 rounded-lg border-2 border-brown-300">
                    <p className="text-4xl font-bold text-brown-900">{formatCurrency(roomPrice)}</p>
                    <p className="text-brown-600 text-sm font-medium">per 12 hours</p>
                  </div>
                </div>

                {/* Rating */}
                {selectedRoom.averageRating > 0 && (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, index) => (
                        <FaStar
                          key={index}
                          className={
                            index < selectedRoom.averageRating
                              ? 'text-yellow-500'
                              : 'text-gray-300'
                          }
                        />
                      ))}
                    </div>
                    <span className="text-brown-600">
                      ({selectedRoom.totalReviews} reviews)
                    </span>
                  </div>
                )}

                {/* Capacity */}
                {selectedRoom.capacity && (
                  <div className="flex items-center gap-6 mb-6 pb-6 border-b border-brown-200">
                    <div className="flex items-center gap-2">
                      <FaUsers className="text-brown-600" />
                      <span className="text-brown-800">
                        {selectedRoom.capacity.adults || 2} Adults
                      </span>
                    </div>
                  </div>
                )}

                {/* Room Details Summary */}
                <div className="bg-brown-50 p-4 rounded-lg mb-6 border border-brown-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-brown-600 text-sm">Room Type</p>
                      <p className="text-brown-900 font-semibold">{selectedRoom.floor}</p>
                    </div>
                    <div>
                      <p className="text-brown-600 text-sm">Rate (12 hours)</p>
                      <p className="text-brown-900 font-semibold text-lg">{formatCurrency(roomPrice)}</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-brown-900 mb-3">About This Room</h2>
                  <p className="text-brown-700 leading-relaxed">
                    {selectedRoom.description || 'Comfortable and well-appointed room designed for your perfect stay. Enjoy modern amenities and a relaxing atmosphere.'}
                  </p>
                </div>

                {/* Amenities */}
                {selectedRoom.amenities && selectedRoom.amenities.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold text-brown-900 mb-3">Amenities</h2>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedRoom.amenities.map((amenity, index) => {
                        const key = (amenity || '').toLowerCase();
                        const Icon = amenityIcons[key] || FaCoffee;
                        return (
                          <div key={index} className="flex items-center gap-2">
                            <Icon size={18} className="text-brown-600 flex-shrink-0" />
                            <span className="text-brown-800">{amenity}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </Card>
            </Motion.div>

            {/* Reviews Section */}
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6">
                <h2 className="text-xl font-bold text-brown-900 mb-4">Guest Reviews</h2>
                {selectedRoom.reviews && selectedRoom.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {selectedRoom.reviews.map((review) => (
                      <div key={review._id} className="border-b border-brown-200 pb-4 last:border-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, index) => (
                              <FaStar
                                key={index}
                                className={
                                  index < review.rating ? 'text-yellow-500' : 'text-gray-300'
                                }
                                size={14}
                              />
                            ))}
                          </div>
                          <span className="text-brown-800 font-semibold">
                            {review.user?.name || 'Guest'}
                          </span>
                          <span className="text-brown-600 text-sm">
                            • {format(new Date(review.createdAt), 'MMM dd, yyyy')}
                          </span>
                        </div>
                        <p className="text-brown-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-brown-600">No reviews yet. Be the first to review!</p>
                )}
              </Card>
            </Motion.div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="sticky top-24"
            >
              <Card className="p-6">
                <h3 className="text-xl font-bold text-brown-900 mb-4">Book This Room</h3>

                {/* Date Pickers */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-brown-700 font-medium mb-2">
                      Check-in Date
                    </label>
                    <DatePicker
                      selected={checkIn}
                      onChange={(date) => setCheckIn(date)}
                      minDate={new Date()}
                      excludeDates={excludedDates}
                      renderDayContents={renderDayContents}
                      highlightDates={excludedDates}
                      placeholderText="Select check-in date"
                      className="w-full px-4 py-2 border border-brown-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-600"
                      dateFormat="MMM dd, yyyy"
                      calendarClassName="booked-dates-calendar"
                    />
                  </div>

                  <div>
                    <label className="block text-brown-700 font-medium mb-2">
                      Check-out Date
                    </label>
                    <DatePicker
                      selected={checkOut}
                      onChange={(date) => setCheckOut(date)}
                      minDate={checkIn || addDays(new Date(), 1)}
                      excludeDates={excludedDates}
                      renderDayContents={renderDayContents}
                      highlightDates={excludedDates}
                      placeholderText="Select check-out date"
                      className="w-full px-4 py-2 border border-brown-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-600"
                      dateFormat="MMM dd, yyyy"
                      calendarClassName="booked-dates-calendar"
                      disabled={!checkIn}
                    />
                  </div>
                </div>

                {/* Book Button */}
                <Button
                  onClick={handleBookNow}
                  className="w-full bg-brown-600 hover:bg-brown-700 text-white"
                >
                  {isAuthenticated ? 'Book Now' : 'Login to Book'}
                </Button>

                {/* Calendar Legend */}
                <div className="mt-6 pt-6 border-t border-brown-200">
                  <p className="text-sm text-brown-600 mb-2">Highlighted dates are unavailable</p>
                  <p className="text-xs text-brown-500">
                    Payment is made upon arrival at the lodge
                  </p>
                </div>
              </Card>
            </Motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailPage;
