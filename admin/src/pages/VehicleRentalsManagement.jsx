import { useState, useEffect } from 'react';
import useVehicleStore from '../store/vehicleStore';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { Dialog } from '../components/ui/Dialog';
import { Table } from '../components/ui/Table';
import { Alert } from '../components/ui/Alert';
import { formatCurrency, formatDate } from '../lib/utils';

const VehicleRentalsManagement = () => {
  const { rentals, loading, error, fetchRentals, updateRentalStatus, updatePaymentStatus, getRentalDetails } = useVehicleStore();
  
  const [filters, setFilters] = useState({
    status: '',
    startDate: '',
    endDate: '',
    search: '',
  });

  const [selectedRental, setSelectedRental] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [newPaymentStatus, setNewPaymentStatus] = useState('');
  const [depositReturned, setDepositReturned] = useState(false);

  useEffect(() => {
    fetchRentals(filters);
  }, [fetchRentals]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleApplyFilters = () => {
    fetchRentals(filters);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      status: '',
      startDate: '',
      endDate: '',
      search: '',
    };
    setFilters(resetFilters);
    fetchRentals(resetFilters);
  };

  const handleViewDetails = async (rental) => {
    const details = await getRentalDetails(rental._id);
    if (details) {
      setSelectedRental(details);
      setShowDetailsDialog(true);
    }
  };

  const handleUpdateStatus = (rental) => {
    setSelectedRental(rental);
    setNewStatus(rental.status);
    setShowStatusDialog(true);
  };

  const handleUpdatePayment = (rental) => {
    setSelectedRental(rental);
    setNewPaymentStatus(rental.paymentStatus);
    setDepositReturned(rental.depositReturned || false);
    setShowPaymentDialog(true);
  };

  const handleConfirmStatusUpdate = async () => {
    if (selectedRental && newStatus) {
      const result = await updateRentalStatus(selectedRental._id, newStatus);
      if (result.success) {
        setShowStatusDialog(false);
        setSelectedRental(null);
      }
    }
  };

  const handleConfirmPaymentUpdate = async () => {
    if (selectedRental && newPaymentStatus) {
      const result = await updatePaymentStatus(selectedRental._id, newPaymentStatus, depositReturned);
      if (result.success) {
        setShowPaymentDialog(false);
        setSelectedRental(null);
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentColor = (status) => {
    const colors = {
      unpaid: 'bg-red-100 text-red-800',
      partial: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      refunded: 'bg-blue-100 text-blue-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-brown-900">Vehicle Rentals Management</h1>
        <p className="text-brown-600 mt-2">Manage all vehicle rental bookings</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-brown-700 mb-2">
                Search
              </label>
              <Input
                type="text"
                placeholder="Customer name or email..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brown-700 mb-2">
                Rental Status
              </label>
              <Select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-brown-700 mb-2">
                Pickup From
              </label>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brown-700 mb-2">
                Pickup To
              </label>
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button onClick={handleApplyFilters}>Apply Filters</Button>
            <Button onClick={handleResetFilters} variant="outline">
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Rentals Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Vehicle Rentals ({rentals?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-brown-600">Loading rentals...</p>
            </div>
          ) : !rentals || rentals.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-brown-600">No rentals found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Vehicle</th>
                    <th>Pickup Date</th>
                    <th>Return Date</th>
                    <th>Days</th>
                    <th>Total Amount</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rentals.map((rental) => (
                    <tr key={rental._id}>
                      <td>
                        <div>
                          <p className="font-medium text-brown-900">
                            {rental.user?.firstName} {rental.user?.lastName}
                          </p>
                          <p className="text-sm text-brown-600">{rental.user?.email}</p>
                        </div>
                      </td>
                      <td>
                        <div>
                          <p className="font-medium text-brown-900">{rental.vehicle?.name}</p>
                          <p className="text-sm text-brown-600">{rental.vehicle?.type}</p>
                        </div>
                      </td>
                      <td>{formatDate(rental.pickupDate)}</td>
                      <td>{formatDate(rental.returnDate)}</td>
                      <td>{rental.rentalDays}</td>
                      <td className="font-medium">{formatCurrency(rental.totalAmount)}</td>
                      <td>
                        <Badge className={getStatusColor(rental.status)}>
                          {rental.status}
                        </Badge>
                      </td>
                      <td>
                        <Badge className={getPaymentColor(rental.paymentStatus)}>
                          {rental.paymentStatus}
                        </Badge>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewDetails(rental)}
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateStatus(rental)}
                          >
                            Status
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdatePayment(rental)}
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

      {/* Rental Details Dialog */}
      <Dialog
        isOpen={showDetailsDialog}
        onClose={() => setShowDetailsDialog(false)}
        title="Vehicle Rental Details"
      >
        {selectedRental && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-brown-600">Rental Number</p>
                <p className="font-medium text-brown-900">{selectedRental.rentalNumber}</p>
              </div>
              <div>
                <p className="text-sm text-brown-600">Created</p>
                <p className="font-medium text-brown-900">
                  {formatDate(selectedRental.createdAt)}
                </p>
              </div>
            </div>

            <div className="border-t border-brown-200 pt-4">
              <h4 className="font-medium text-brown-900 mb-2">Customer Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-brown-600">Name</p>
                  <p className="font-medium text-brown-900">
                    {selectedRental.user?.firstName} {selectedRental.user?.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-brown-600">Email</p>
                  <p className="font-medium text-brown-900">{selectedRental.user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-brown-600">Phone</p>
                  <p className="font-medium text-brown-900">
                    {selectedRental.user?.phone || selectedRental.contactInfo?.phone || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-brown-200 pt-4">
              <h4 className="font-medium text-brown-900 mb-2">Vehicle Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-brown-600">Vehicle</p>
                  <p className="font-medium text-brown-900">{selectedRental.vehicle?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-brown-600">Type</p>
                  <p className="font-medium text-brown-900">{selectedRental.vehicle?.type}</p>
                </div>
                <div>
                  <p className="text-sm text-brown-600">Daily Rate</p>
                  <p className="font-medium text-brown-900">
                    {formatCurrency(selectedRental.dailyRate)}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-brown-200 pt-4">
              <h4 className="font-medium text-brown-900 mb-2">Rental Period</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-brown-600">Pickup Date</p>
                  <p className="font-medium text-brown-900">
                    {formatDate(selectedRental.pickupDate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-brown-600">Return Date</p>
                  <p className="font-medium text-brown-900">
                    {formatDate(selectedRental.returnDate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-brown-600">Rental Days</p>
                  <p className="font-medium text-brown-900">{selectedRental.rentalDays}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-brown-200 pt-4">
              <h4 className="font-medium text-brown-900 mb-2">Payment Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-brown-600">Rental Cost</p>
                  <p className="font-medium text-brown-900">
                    {formatCurrency(selectedRental.rentalCost)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-brown-600">Security Deposit</p>
                  <p className="font-medium text-brown-900">
                    {formatCurrency(selectedRental.securityDeposit)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-brown-600">Total Amount</p>
                  <p className="font-medium text-brown-900">
                    {formatCurrency(selectedRental.totalAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-brown-600">Deposit Returned</p>
                  <p className="font-medium text-brown-900">
                    {selectedRental.depositReturned ? 'Yes' : 'No'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-brown-600">Payment Status</p>
                  <Badge className={getPaymentColor(selectedRental.paymentStatus)}>
                    {selectedRental.paymentStatus}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-brown-600">Rental Status</p>
                  <Badge className={getStatusColor(selectedRental.status)}>
                    {selectedRental.status}
                  </Badge>
                </div>
              </div>
            </div>

            {selectedRental.specialRequests && (
              <div className="border-t border-brown-200 pt-4">
                <h4 className="font-medium text-brown-900 mb-2">Special Requests</h4>
                <p className="text-brown-700">{selectedRental.specialRequests}</p>
              </div>
            )}
          </div>
        )}
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog
        isOpen={showStatusDialog}
        onClose={() => setShowStatusDialog(false)}
        title="Update Rental Status"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-brown-700 mb-2">
              New Status
            </label>
            <Select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowStatusDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmStatusUpdate}>Update Status</Button>
          </div>
        </div>
      </Dialog>

      {/* Update Payment Dialog */}
      <Dialog
        isOpen={showPaymentDialog}
        onClose={() => setShowPaymentDialog(false)}
        title="Update Payment Status"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-brown-700 mb-2">
              Payment Status
            </label>
            <Select
              value={newPaymentStatus}
              onChange={(e) => setNewPaymentStatus(e.target.value)}
            >
              <option value="unpaid">Unpaid</option>
              <option value="partial">Partial</option>
              <option value="paid">Paid</option>
              <option value="refunded">Refunded</option>
            </Select>
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={depositReturned}
                onChange={(e) => setDepositReturned(e.target.checked)}
                className="rounded border-brown-300 text-brown-600 focus:ring-brown-500"
              />
              <span className="text-sm font-medium text-brown-700">
                Security Deposit Returned
              </span>
            </label>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmPaymentUpdate}>Update Payment</Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default VehicleRentalsManagement;
