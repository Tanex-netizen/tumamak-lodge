import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useBookingStore } from '../store/bookingStore';
import { motion as Motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { formatCurrency } from '../lib/utils';
import { FaCalendar, FaUsers, FaBed, FaMoneyBillWave } from 'react-icons/fa';
// note: addDays removed (unused)
import axios from '../lib/axios';

const BookingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();
  const { createBooking } = useBookingStore();

  // Get room and dates from navigation state (from RoomDetailPage)
  const { room, checkIn: initialCheckIn, checkOut: initialCheckOut } = location.state || {};

  // Convert dates to Date objects if they're strings
  const [checkIn, setCheckIn] = useState(
    initialCheckIn ? new Date(initialCheckIn) : null
  );
  const [checkOut, setCheckOut] = useState(
    initialCheckOut ? new Date(initialCheckOut) : null
  );
  const [adults, setAdults] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('arrival'); // 'arrival' - pay on arrival
  const [error, setError] = useState('');
  const [bookedDates, setBookedDates] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hold timer disabled - direct booking allowed
  // const [holdId, setHoldId] = useState(null);
  // const [holdTimeRemaining, setHoldTimeRemaining] = useState(null);

  // Fetch booked dates for the room
  useEffect(() => {
    const fetchBookedDates = async () => {
      if (room?._id) {
        try {
          const { data } = await axios.get(`/bookings/room/${room._id}/booked-dates`);
          console.log('Fetched booked dates:', data.data); // Debug log
          // Convert string dates to normalized local Date objects at midnight
          const dates = data.data.map((dateStr) => {
            const parsed = new Date(dateStr);
            return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
          });
          console.log('Converted to Date objects:', dates); // Debug log
          setBookedDates(dates);
        } catch (error) {
          console.error('Error fetching booked dates:', error);
        }
      }
    };
    
    fetchBookedDates();
  }, [room?._id]);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/booking', room, checkIn, checkOut } });
      return;
    }

    // Redirect to rooms if no room data
    if (!room) {
      navigate('/rooms');
    }
  }, [isAuthenticated, room, navigate, checkIn, checkOut]);

  if (!room) {
    return null;
  }

  // Check if a date is booked
  const isDateBooked = (date) => {
    if (!date) return false;
    const isBooked = bookedDates.some(
      bookedDate => 
        bookedDate.getFullYear() === date.getFullYear() &&
        bookedDate.getMonth() === date.getMonth() &&
        bookedDate.getDate() === date.getDate()
    );
    if (isBooked) {
      console.log('Date is booked:', date.toDateString()); // Debug log
    }
    return isBooked;
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

  const roomPrice = room.price || 0;
  
  // Calculate number of 12-hour periods based on overnight stays
  // If check-in and check-out are on different days, count as 1 period (12 hours)
  // If same day but different times, still count as 1 period
  const calculatePeriods = () => {
    if (!checkIn || !checkOut) return 0;
    
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    // Get date only (ignore time)
    const checkInDay = new Date(checkInDate.getFullYear(), checkInDate.getMonth(), checkInDate.getDate());
    const checkOutDay = new Date(checkOutDate.getFullYear(), checkOutDate.getMonth(), checkOutDate.getDate());
    
    // Calculate difference in days
    const diffInMs = checkOutDay - checkInDay;
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    
    // Each night/day counts as 1 period (12 hours)
    // Same day = 1 period, Next day = 1 period, 2 days later = 2 periods
    const periods = diffInDays === 0 ? 1 : Math.ceil(diffInDays);
    return periods;
  };

  const periods = calculatePeriods();
  const subtotal = roomPrice * periods; // subtotal before reservation fee
  const reservationFee = Math.round(subtotal * 0.12); // 12% reservation fee
  const totalAmount = subtotal + reservationFee; // final total shown on receipt

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Validation
    if (!checkIn || !checkOut) {
      setError('Please select check-in and check-out dates');
      setIsSubmitting(false);
      return;
    }

    if (checkIn >= checkOut) {
      setError('Check-out date must be after check-in date');
      setIsSubmitting(false);
      return;
    }

    if (adults < 1) {
      setError('At least 1 adult is required');
      setIsSubmitting(false);
      return;
    }

      if (room.capacity) {
        if (adults > room.capacity.adults) {
          setError(`Maximum ${room.capacity.adults} adults allowed for this room`);
          setIsSubmitting(false);
          return;
        }
      }

    try {
      // Direct booking without hold
      const bookingData = {
        roomId: room._id,
        checkInDate: checkIn.toISOString(),
        checkOutDate: checkOut.toISOString(),
        guests: {
          adults,
        },
        numberOfNights: periods,
        reservationFee,
        specialRequests,
      };

      const result = await createBooking(bookingData);
      
      if (result.success) {
        // Navigate to profile page to view booking
        navigate('/profile', { 
          state: { 
            message: 'Booking created successfully! Pay on arrival.',
            bookingId: result.booking._id 
          } 
        });
      } else {
        setError(result.error || 'Failed to create booking');
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error('Booking error:', err);
      setError(err.message || 'Failed to create booking');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brown-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-brown-900 mb-2">Complete Your Booking</h1>
          <p className="text-brown-600 mb-8">Fill in the details below to reserve your room</p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Booking Form */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <form onSubmit={handleSubmit}>
                  {/* Date Selection */}
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-brown-900 mb-4 flex items-center gap-2">
                      <FaCalendar className="text-brown-600" />
                      Select Dates
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="checkIn">Check-in Date & Time</Label>
                        <DatePicker
                          selected={checkIn}
                          onChange={setCheckIn}
                          showTimeSelect
                          timeFormat="HH:mm"
                          timeIntervals={60}
                          dateFormat="MMMM d, yyyy h:mm aa"
                          minDate={new Date()}
                          renderDayContents={renderDayContents}
                          highlightDates={bookedDates}
                          className="w-full px-4 py-2 border border-brown-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-600"
                          placeholderText="Select check-in date & time"
                          calendarClassName="booked-dates-calendar"
                        />
                      </div>
                      <div>
                        <Label htmlFor="checkOut">Check-out Date & Time</Label>
                        <DatePicker
                          selected={checkOut}
                          onChange={setCheckOut}
                          showTimeSelect
                          timeFormat="HH:mm"
                          timeIntervals={60}
                          dateFormat="MMMM d, yyyy h:mm aa"
                          minDate={checkIn || new Date()}
                          renderDayContents={renderDayContents}
                          highlightDates={bookedDates}
                          className="w-full px-4 py-2 border border-brown-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-600"
                          placeholderText="Select check-out date & time"
                          calendarClassName="booked-dates-calendar"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Guest Count */}
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-brown-900 mb-4 flex items-center gap-2">
                      <FaUsers className="text-brown-600" />
                      Number of Guests
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="adults">Adults</Label>
                        <select
                          id="adults"
                          value={adults}
                          onChange={(e) => setAdults(parseInt(e.target.value))}
                          className="mt-1 w-full px-3 py-2 border border-brown-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"
                        >
                          <option value="">Select number of guests</option>
                          <option value="2">2 persons (Rooms 1, 2, 3, 4, 5, 6, 7, 9, 12, 13, 14, 16)</option>
                          <option value="3">3 persons (Rooms 10, 11, 15)</option>
                          <option value="4">4 persons (Room 8)</option>
                        </select>
                        <p className="text-sm text-brown-600 mt-1">
                          Max: {room.capacity?.adults || 2} adults for this room
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div className="mb-6">
                    <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
                    <Textarea
                      id="specialRequests"
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder="Any special requests or requirements..."
                      className="mt-1 min-h-[100px]"
                    />
                  </div>

                  {/* Payment Method */}
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-brown-900 mb-4 flex items-center gap-2">
                      <FaMoneyBillWave className="text-brown-600" />
                      Payment Method
                    </h2>
                    <div className="p-4 border-2 border-brown-600 bg-brown-50 rounded-lg">
                      <div className="flex items-start">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="arrival"
                          checked={paymentMethod === 'arrival'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="mt-1 mr-3"
                          readOnly
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-brown-900">Pay on Arrival</p>
                          <p className="text-sm text-brown-600">
                            Pay the full amount when you check in at the lodge
                          </p>
                          <p className="text-xs text-brown-500 mt-2">
                            Note: A 12% reservation fee (₱{reservationFee.toLocaleString()}) is included in your total for booking confirmation.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-600">{error}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full bg-brown-600 hover:bg-brown-700 text-white py-6 text-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating Booking...' : 'Confirm Booking'}
                  </Button>
                </form>
              </Card>
            </div>

            {/* Right Column - Booking Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-6">
                <h2 className="text-xl font-bold text-brown-900 mb-4">Booking Summary</h2>

                {/* Room Info */}
                <div className="mb-4 pb-4 border-b border-brown-200">
                  <div className="flex items-center gap-3 mb-2">
                    <FaBed className="text-brown-600 text-xl" />
                    <div>
                      <h3 className="font-semibold text-brown-900">{room.name}</h3>
                      <p className="text-sm text-brown-600">{room.floor}</p>
                    </div>
                  </div>
                </div>

                {/* Dates */}
                {checkIn && checkOut && (
                  <div className="mb-4 pb-4 border-b border-brown-200">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-brown-600">Check-in:</span>
                        <span className="text-brown-900 font-medium">
                          {checkIn.toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-brown-600">Check-out:</span>
                        <span className="text-brown-900 font-medium">
                          {checkOut.toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-brown-600">Duration:</span>
                        <span className="text-brown-900 font-medium">
                          {periods} period(s) (12h each)
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Guests */}
                <div className="mb-4 pb-4 border-b border-brown-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-brown-600">Guests:</span>
                    <span className="text-brown-900 font-medium">
                      {adults} Adult{adults > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {/* Price Breakdown */}
                {checkIn && checkOut && (
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-brown-600">
                        {formatCurrency(roomPrice)} × {periods} period(s)
                      </span>
                      <span className="text-brown-900">{formatCurrency(subtotal)}</span>
                    </div>
                    
                    <div className="pt-3 border-t border-brown-300">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-brown-900">Subtotal:</span>
                        <span className="text-lg font-semibold text-brown-900">
                          {formatCurrency(subtotal)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-brown-600">
                        <span>Reservation Fee (12%):</span>
                        <span className="font-medium">
                          {formatCurrency(reservationFee)}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t-2 border-brown-900">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-brown-900">Total Amount:</span>
                        <span className="text-2xl font-bold text-brown-900">
                          {formatCurrency(totalAmount)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 p-3 bg-brown-100 rounded-lg">
                      <p className="text-sm text-brown-700 text-center font-medium">
                        Pay full amount on arrival
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
  </Motion.div>
      </div>
    </div>
  );
};

export default BookingPage;
