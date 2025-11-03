import { useState, useEffect } from 'react';
import useBookingStore from '../store/bookingStore';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/Dialog';
import { Table } from '../components/ui/Table';
import { Alert } from '../components/ui/Alert';
import { formatCurrency, formatDate } from '../lib/utils';

const BookingsManagement = () => {
  const { bookings, loading, error, fetchBookings, updateBookingStatus, updatePaymentStatus, getBookingDetails } = useBookingStore();
  
  const [filters, setFilters] = useState({
    status: '',
    paymentStatus: '',
    startDate: '',
    endDate: '',
    search: '',
  });

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [newPaymentStatus, setNewPaymentStatus] = useState('');

  useEffect(() => {
    fetchBookings(filters);
  }, [fetchBookings, filters]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleApplyFilters = () => {
    fetchBookings(filters);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      status: '',
      paymentStatus: '',
      startDate: '',
      endDate: '',
      search: '',
    };
    setFilters(resetFilters);
    fetchBookings(resetFilters);
  };

  const handleViewDetails = async (booking) => {
    const details = await getBookingDetails(booking._id);
    if (details) {
      setSelectedBooking(details);
      setShowDetailsDialog(true);
    }
  };

  const handleUpdateStatus = (booking) => {
    setSelectedBooking(booking);
    setNewStatus(booking.status);
    setShowStatusDialog(true);
  };

  const handleUpdatePayment = (booking) => {
    setSelectedBooking(booking);
    setNewPaymentStatus(booking.paymentStatus);
    setShowPaymentDialog(true);
  };

  const handleConfirmStatusUpdate = async () => {
    if (selectedBooking && newStatus) {
      const result = await updateBookingStatus(selectedBooking._id, newStatus);
      if (result.success) {
        setShowStatusDialog(false);
        setSelectedBooking(null);
      }
    }
  };

  const handleConfirmPaymentUpdate = async () => {
    if (selectedBooking && newPaymentStatus) {
      const result = await updatePaymentStatus(selectedBooking._id, newPaymentStatus);
      if (result.success) {
        setShowPaymentDialog(false);
        setSelectedBooking(null);
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      'checked-in': 'bg-green-100 text-green-800',
      'checked-out': 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentColor = (status) => {
    const colors = {
      unpaid: 'bg-yellow-100 text-yellow-800',
      'reservation-paid': 'bg-blue-100 text-blue-800',
      'fully-paid': 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-brown-900">Bookings Management</h1>
        <p className="text-brown-600 mt-2">Manage all lodge bookings</p>
      </div>

      {error && (
        <Alert variant="error" className="mb-6">
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-brown-700 mb-2">
                Search
              </label>
              <Input
                type="text"
                placeholder="Guest name or email..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brown-700 mb-2">
                Booking Status
              </label>
              <Select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="checked-in">Checked In</option>
                <option value="checked-out">Checked Out</option>
                <option value="cancelled">Cancelled</option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-brown-700 mb-2">
                Payment Status
              </label>
              <Select
                value={filters.paymentStatus}
                onChange={(e) => handleFilterChange('paymentStatus', e.target.value)}
              >
                <option value="">All Payment Status</option>
                <option value="pending">Pending</option>
                <option value="reservation-paid">Reservation Paid</option>
                <option value="paid">Paid</option>
                <option value="refunded">Refunded</option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-brown-700 mb-2">
                Check-in From
              </label>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brown-700 mb-2">
                Check-in To
              </label>
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
              />
            </div>

            <div className="flex items-end gap-2">
              <Button onClick={handleApplyFilters} className="flex-1">
                Apply Filters
              </Button>
              <Button onClick={handleResetFilters} variant="outline">
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Bookings ({bookings?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-brown-600">Loading bookings...</p>
            </div>
          ) : !bookings || bookings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-brown-600">No bookings found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="w-auto">
                <thead>
                  <tr>
                    <th className="h-12 px-6 text-left align-middle font-medium text-brown-700">Guest</th>
                    <th className="h-12 px-6 text-left align-middle font-medium text-brown-700">Room</th>
                    <th className="h-12 px-6 text-left align-middle font-medium text-brown-700">Check-in</th>
                    <th className="h-12 px-6 text-left align-middle font-medium text-brown-700">Check-out</th>
                    <th className="h-12 px-6 text-left align-middle font-medium text-brown-700">Guests</th>
                    <th className="h-12 px-6 text-right align-middle font-medium text-brown-700">Total</th>
                    <th className="h-12 px-6 text-left align-middle font-medium text-brown-700">Status</th>
                    <th className="h-12 px-6 text-left align-middle font-medium text-brown-700">Payment</th>
                    <th className="h-12 px-6 text-left align-middle font-medium text-brown-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id}>
                      <td className="px-6 py-4 align-middle whitespace-normal">
                        <div>
                          <p className="font-medium text-brown-900">
                            {booking.user?.firstName} {booking.user?.lastName}
                          </p>
                          <p className="text-sm text-brown-600">{booking.user?.email}</p>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 align-middle">{booking.room?.name || 'N/A'}</td>
                      <td className="px-4 sm:px-6 py-4 align-middle">{formatDate(booking.checkInDate)}</td>
                      <td className="px-4 sm:px-6 py-4 align-middle">{formatDate(booking.checkOutDate)}</td>
                      <td className="px-4 sm:px-6 py-4 align-middle"> 
                        {typeof booking.guests === 'object' 
                          ? `${booking.guests.adults || 0}A, ${booking.guests.children || 0}C`
                          : booking.guests || 0}
                      </td>
                      <td className="px-4 sm:px-6 py-4 align-middle font-medium text-right">{formatCurrency(booking.totalAmount || 0)}</td>
                      <td className="px-4 sm:px-6 py-4 align-middle">
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </td>
                      <td className="px-4 sm:px-6 py-4 align-middle">
                        <Badge className={getPaymentColor(booking.paymentStatus)}>
                          {booking.paymentStatus}
                        </Badge>
                      </td>
                      <td className="px-4 sm:px-6 py-4 align-middle">
                        <div className="flex gap-3 items-center justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewDetails(booking)}
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateStatus(booking)}
                          >
                            Status
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdatePayment(booking)}
                          >
                            Payment
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Booking Details Dialog */}
      <Dialog
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
      >
        <DialogContent onClose={() => setShowDetailsDialog(false)}>
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-brown-600">Booking ID</p>
                <p className="font-medium text-brown-900">{selectedBooking._id}</p>
              </div>
              <div>
                <p className="text-sm text-brown-600">Created</p>
                <p className="font-medium text-brown-900">
                  {formatDate(selectedBooking.createdAt)}
                </p>
              </div>
            </div>

            <div className="border-t border-brown-200 pt-4">
              <h4 className="font-medium text-brown-900 mb-2">Guest Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-brown-600">Name</p>
                  <p className="font-medium text-brown-900">
                    {selectedBooking.user?.firstName} {selectedBooking.user?.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-brown-600">Email</p>
                  <p className="font-medium text-brown-900">{selectedBooking.user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-brown-600">Phone</p>
                  <p className="font-medium text-brown-900">
                    {selectedBooking.user?.phone || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-brown-200 pt-4">
              <h4 className="font-medium text-brown-900 mb-2">Booking Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-brown-600">Room</p>
                  <p className="font-medium text-brown-900">{selectedBooking.room?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-brown-600">Room Type</p>
                  <p className="font-medium text-brown-900">{selectedBooking.room?.type}</p>
                </div>
                <div>
                  <p className="text-sm text-brown-600">Check-in</p>
                  <p className="font-medium text-brown-900">
                    {formatDate(selectedBooking.checkInDate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-brown-600">Check-out</p>
                  <p className="font-medium text-brown-900">
                    {formatDate(selectedBooking.checkOutDate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-brown-600">Number of Guests</p>
                  <p className="font-medium text-brown-900">
                    {typeof selectedBooking.guests === 'object' 
                      ? `Adults: ${selectedBooking.guests.adults || 0}, Children: ${selectedBooking.guests.children || 0}`
                      : selectedBooking.guests || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-brown-600">Number of Nights</p>
                  <p className="font-medium text-brown-900">
                    {selectedBooking.numberOfNights || Math.ceil(
                      (new Date(selectedBooking.checkOutDate) - new Date(selectedBooking.checkInDate)) /
                        (1000 * 60 * 60 * 24)
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-brown-200 pt-4">
              <h4 className="font-medium text-brown-900 mb-2">Payment Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-brown-600">Total Price</p>
                  <p className="font-medium text-brown-900">
                    {formatCurrency(selectedBooking.totalAmount || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-brown-600">Reservation Fee</p>
                  <p className="font-medium text-brown-900">
                    {formatCurrency(selectedBooking.reservationFee || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-brown-600">Payment Status</p>
                  <Badge className={getPaymentColor(selectedBooking.paymentStatus)}>
                    {selectedBooking.paymentStatus}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-brown-600">Booking Status</p>
                  <Badge className={getStatusColor(selectedBooking.status)}>
                    {selectedBooking.status}
                  </Badge>
                </div>
              </div>
            </div>

            {selectedBooking.specialRequests && (
              <div className="border-t border-brown-200 pt-4">
                <h4 className="font-medium text-brown-900 mb-2">Special Requests</h4>
                <p className="text-brown-700">{selectedBooking.specialRequests}</p>
              </div>
            )}
          </div>
        )}
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog
        open={showStatusDialog}
        onOpenChange={setShowStatusDialog}
      >
        <DialogContent onClose={() => setShowStatusDialog(false)}>
          <DialogHeader>
            <DialogTitle>Update Booking Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brown-700 mb-2">
                New Status
              </label>
              <Select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="checked-in">Checked In</option>
                <option value="checked-out">Checked Out</option>
                <option value="cancelled">Cancelled</option>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStatusDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmStatusUpdate}>Update Status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Payment Dialog */}
      <Dialog
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
      >
        <DialogContent onClose={() => setShowPaymentDialog(false)}>
          <DialogHeader>
            <DialogTitle>Update Payment Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brown-700 mb-2">
                New Payment Status
              </label>
              <Select
                value={newPaymentStatus}
                onChange={(e) => setNewPaymentStatus(e.target.value)}
              >
                <option value="unpaid">Unpaid</option>
                <option value="reservation-paid">Reservation Paid</option>
                <option value="fully-paid">Fully Paid</option>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmPaymentUpdate}>Update Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingsManagement;
