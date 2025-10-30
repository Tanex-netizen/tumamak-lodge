import { useState, useEffect } from 'react';
import { useRoomStore } from '../store/roomStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/Dialog';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Users, Bed, X, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from '../lib/axios';

export default function WalkInBookings() {
  const { rooms, fetchRooms, loading } = useRoomStore();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookedDates, setBookedDates] = useState([]);
  const [roomBookings, setRoomBookings] = useState([]); // Store all bookings for selected room
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deletingBookingId, setDeletingBookingId] = useState(null);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  // Fetch booked dates when a room is selected
  useEffect(() => {
    if (selectedRoom) {
      fetchBookedDates(selectedRoom._id);
      fetchRoomBookings(selectedRoom._id);
    }
  }, [selectedRoom]);

  const fetchBookedDates = async (roomId) => {
    try {
      const response = await axios.get(`/bookings/room/${roomId}/booked-dates`);
      const dates = response.data.data || response.data || [];
      // Convert string dates to Date objects
      const dateObjects = dates.map(dateStr => new Date(dateStr + 'T00:00:00'));
      setBookedDates(dateObjects);
    } catch (error) {
      console.error('Error fetching booked dates:', error);
      setBookedDates([]);
    }
  };

  const fetchRoomBookings = async (roomId) => {
    try {
      const response = await axios.get(`/bookings?roomId=${roomId}`);
      const allBookings = response.data.data || response.data || [];
      // Filter only walk-in bookings (paymentStatus === 'walk-in')
      const walkInBookings = allBookings.filter(b => b.paymentStatus === 'walk-in' && b.status !== 'cancelled');
      setRoomBookings(walkInBookings);
    } catch (error) {
      console.error('Error fetching room bookings:', error);
      setRoomBookings([]);
    }
  };

  const isDateBooked = (date) => {
    return bookedDates.some(bookedDate => {
      return (
        bookedDate.getFullYear() === date.getFullYear() &&
        bookedDate.getMonth() === date.getMonth() &&
        bookedDate.getDate() === date.getDate()
      );
    });
  };

  // Custom day rendering to show red slash on booked dates
  const renderDayContents = (day, date) => {
    const isBooked = isDateBooked(date);
    
    return (
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <span>{day}</span>
        {isBooked && (
          <span
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'red',
              fontSize: '32px',
              fontWeight: 'bold',
              pointerEvents: 'none',
              zIndex: 10,
            }}
          >
            /
          </span>
        )}
      </div>
    );
  };

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
    setCheckInDate(null);
    setCheckOutDate(null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedRoom(null);
    setCheckInDate(null);
    setCheckOutDate(null);
  };

  const handleSubmitWalkIn = async () => {
    if (!selectedRoom || !checkInDate || !checkOutDate) {
      toast.error('Please select both check-in and check-out dates');
      return;
    }

    if (checkOutDate <= checkInDate) {
      toast.error('Check-out date must be after check-in date');
      return;
    }

    // Check if any selected dates are already booked
    const currentDate = new Date(checkInDate);
    const endDate = new Date(checkOutDate);
    
    while (currentDate < endDate) {
      if (isDateBooked(currentDate)) {
        toast.error('Some of the selected dates are already booked');
        return;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    setSubmitting(true);

    try {
      await axios.post('/bookings/walk-in', {
        roomId: selectedRoom._id,
        checkInDate: checkInDate.toISOString(),
        checkOutDate: checkOutDate.toISOString(),
        guestName: 'Walk-in Guest',
        guestPhone: 'N/A',
        guests: 1,
        notes: 'Walk-in booking - front desk',
      });

      toast.success('Dates marked as booked successfully!');
      
      // Refresh booked dates and bookings list
      await fetchBookedDates(selectedRoom._id);
      await fetchRoomBookings(selectedRoom._id);
      
      // Reset form
      setCheckInDate(null);
      setCheckOutDate(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to mark dates as booked');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to remove this booking? The dates will be available again.')) {
      return;
    }

    setDeletingBookingId(bookingId);

    try {
      await axios.delete(`/bookings/${bookingId}`);
      toast.success('Booking removed successfully!');
      
      // Refresh booked dates and bookings list
      await fetchBookedDates(selectedRoom._id);
      await fetchRoomBookings(selectedRoom._id);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove booking');
    } finally {
      setDeletingBookingId(null);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-brown-900">Walk-in Bookings</h1>
        <p className="text-sm sm:text-base text-brown-600 mt-1">
          Select a room and mark dates as booked. Red slashes will appear on the calendar.
        </p>
      </div>

      {/* Room Selection Grid */}
      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-brown-900 mb-3 sm:mb-4">Select a Room to Mark Dates</h2>
        {loading ? (
          <div className="text-center py-8 text-brown-600">Loading rooms...</div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-8 text-brown-600">No rooms available</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {rooms.map((room) => (
              <Card
                key={room._id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleRoomSelect(room)}
              >
                <CardHeader className="pb-2 sm:pb-3">
                  <CardTitle className="text-base sm:text-lg">{room.name}</CardTitle>
                  <p className="text-xs sm:text-sm text-brown-600">Room {room.roomNumber}</p>
                </CardHeader>
                <CardContent>
                  {room.images && room.images.length > 0 && (
                    <img
                      src={room.images[0]}
                      alt={room.name}
                      className="w-full h-24 sm:h-32 object-cover rounded mb-2 sm:mb-3"
                    />
                  )}
                  <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-brown-700">
                    <div className="flex items-center gap-2">
                      <Bed className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="truncate">{room.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="text-xs sm:text-sm">
                        {typeof room.capacity === 'object' 
                          ? `${room.capacity.adults} adults, ${room.capacity.children} children`
                          : room.capacity}
                      </span>
                    </div>
                    <div className="mt-2">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs ${
                          room.isAvailable
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {room.isAvailable ? 'Available' : 'Not Available'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Date Selection Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-full sm:max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto mx-2 sm:mx-auto">
          <DialogHeader>
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-base sm:text-lg truncate">
                  Mark Dates - {selectedRoom?.name}
                </DialogTitle>
              </div>
              <button
                onClick={handleCloseDialog}
                className="text-brown-600 hover:text-brown-900 flex-shrink-0"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-xs sm:text-sm text-brown-600 mt-2">
              Room {selectedRoom?.roomNumber} - Select check-in and check-out dates
            </p>
          </DialogHeader>

          <div className="space-y-4 sm:space-y-6 py-2 sm:py-4">
            <div className="bg-brown-50 p-3 sm:p-4 rounded-lg">
              <p className="text-xs sm:text-sm text-brown-700">
                <strong>Instructions:</strong> Select the dates you want to mark as booked. 
                Red slashes (/) will appear on these dates in the customer's calendar view.
              </p>
            </div>

            {/* Current Walk-in Bookings List */}
            {roomBookings.length > 0 && (
              <div className="bg-white border border-brown-200 rounded-lg p-3 sm:p-4">
                <h3 className="text-xs sm:text-sm font-semibold text-brown-900 mb-2 sm:mb-3">Current Walk-in Bookings</h3>
                <div className="space-y-2 max-h-40 sm:max-h-48 overflow-y-auto">
                  {roomBookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 sm:p-3 bg-brown-50 rounded border border-brown-100"
                    >
                      <div className="text-xs sm:text-sm flex-1 min-w-0">
                        <p className="font-medium text-brown-900 truncate">
                          {new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-brown-600 truncate">
                          {booking.guestName || 'Walk-in Guest'} • {booking.numberOfNights} night(s)
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteBooking(booking._id)}
                        disabled={deletingBookingId === booking._id}
                        className="text-red-600 border-red-200 hover:bg-red-50 w-full sm:w-auto"
                      >
                        <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-1" />
                        <span className="sm:inline">Delete</span>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-brown-900 mb-2">
                  Check-in Date *
                </label>
                <div className="border border-brown-200 rounded-md p-1 sm:p-2 overflow-x-auto">
                  <DatePicker
                    selected={checkInDate}
                    onChange={(date) => setCheckInDate(date)}
                    minDate={new Date()}
                    dateFormat="yyyy-MM-dd"
                    inline
                    renderDayContents={renderDayContents}
                    calendarClassName="booked-dates-calendar mobile-calendar"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-brown-900 mb-2">
                  Check-out Date *
                </label>
                <div className="border border-brown-200 rounded-md p-1 sm:p-2 overflow-x-auto">
                  <DatePicker
                    selected={checkOutDate}
                    onChange={(date) => setCheckOutDate(date)}
                    minDate={checkInDate || new Date()}
                    dateFormat="yyyy-MM-dd"
                    inline
                    renderDayContents={renderDayContents}
                    calendarClassName="booked-dates-calendar mobile-calendar"
                  />
                </div>
              </div>
            </div>

            {checkInDate && checkOutDate && (
              <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-200">
                <p className="text-xs sm:text-sm text-blue-900">
                  <strong>Selected:</strong> {checkInDate.toLocaleDateString()} to {checkOutDate.toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={handleCloseDialog}
              disabled={submitting}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitWalkIn}
              disabled={submitting || !checkInDate || !checkOutDate}
              className="w-full sm:w-auto order-1 sm:order-2"
            >
              {submitting ? 'Marking...' : 'Confirm & Mark as Booked'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
