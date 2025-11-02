import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { Calendar, User, Phone, Mail, MapPin, CreditCard, Clock, AlertCircle } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { useAuthStore } from '../store/authStore';
import useVehicleRentalStore from '../store/vehicleRentalStore';
import axios from '../lib/axios';

const VehicleCheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const { createRental, loading, error, clearError } = useVehicleRentalStore();

  const vehicle = location.state?.vehicle;

  const [formData, setFormData] = useState({
    pickupDate: '',
    returnDate: '',
    pickupTime: '09:00',
    returnTime: '09:00',
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    licenseNumber: '',
    emergencyContact: '',
    emergencyPhone: '',
    specialRequests: '',
  });

  const [rentalDays, setRentalDays] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [securityDeposit, setSecurityDeposit] = useState(0);
  const [bookedDates, setBookedDates] = useState([]);
  const [pickupDate, setPickupDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);

  // Fetch booked dates for the vehicle
  useEffect(() => {
    const fetchBookedDates = async () => {
      if (vehicle?._id) {
        try {
          const { data } = await axios.get(`/vehicle-rentals/vehicle/${vehicle._id}/booked-dates`);
          
          // Convert string dates to Date objects (normalized to local midnight)
          if (data.success && data.data.length > 0) {
            const dates = data.data.map((dateStr) => {
              const parsed = new Date(dateStr);
              return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
            });
            setBookedDates(dates);
          } else {
            setBookedDates([]);
          }
        } catch (error) {
          console.error('Error fetching booked dates:', error);
          setBookedDates([]);
        }
      }
    };
    
    fetchBookedDates();
  }, [vehicle?._id]);

  useEffect(() => {
    // Redirect if no vehicle selected
    if (!vehicle) {
      navigate('/vehicles');
      return;
    }

    // Redirect if not logged in
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }

    // Calculate security deposit based on vehicle type
    const deposit = vehicle.type === 'Motorcycle' ? 5000 : 10000;
    setSecurityDeposit(deposit);
  }, [vehicle, user, navigate, location]);

  useEffect(() => {
    // Calculate rental days and total cost
    if (pickupDate && returnDate) {
      const days = Math.ceil((returnDate - pickupDate) / (1000 * 60 * 60 * 24));
      
      if (days > 0) {
        setRentalDays(days);
        setTotalCost(days * vehicle.pricePerDay);
        
        // Update formData with ISO strings
        setFormData((prev) => ({
          ...prev,
          pickupDate: pickupDate.toISOString().split('T')[0],
          returnDate: returnDate.toISOString().split('T')[0],
        }));
      } else {
        setRentalDays(0);
        setTotalCost(0);
      }
    }
  }, [pickupDate, returnDate, vehicle?.pricePerDay]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Check if a date is booked
  const isDateBooked = (date) => {
    if (!date) return false;
    return bookedDates.some(
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

  // Filter out booked dates
  const filterDate = (date) => {
    return !isDateBooked(date);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    // Validation
    if (!formData.pickupDate || !formData.returnDate) {
      alert('Please select pickup and return dates');
      return;
    }

    if (rentalDays <= 0) {
      alert('Return date must be after pickup date');
      return;
    }

    if (!formData.phone || !formData.address || !formData.licenseNumber) {
      alert('Please fill in all required fields');
      return;
    }

    // Create rental data
    const rentalData = {
      vehicleId: vehicle._id,
      pickupDate: `${formData.pickupDate}T${formData.pickupTime}`,
      returnDate: `${formData.returnDate}T${formData.returnTime}`,
      rentalDays,
      totalAmount: totalCost + securityDeposit,
      dailyRate: vehicle.pricePerDay,
      securityDeposit,
      contactInfo: {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        licenseNumber: formData.licenseNumber,
        emergencyContact: formData.emergencyContact,
        emergencyPhone: formData.emergencyPhone,
      },
      specialRequests: formData.specialRequests,
    };

    const result = await createRental(rentalData);

    if (result.success) {
      alert('Vehicle rental confirmed successfully!');
      navigate('/profile', { state: { tab: 'rentals' } });
    }
  };

  if (!vehicle) {
    return null;
  }

  return (
    <div className="min-h-screen bg-brown-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <Motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-brown-900 mb-2">
            Complete Your Rental
          </h1>
          <p className="text-brown-600">
            Fill in your details to confirm your vehicle rental
          </p>
  </Motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error Display */}
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center gap-2">
                    <AlertCircle size={20} />
                    {error}
                  </div>
                )}

                {/* Rental Dates */}
                <div>
                  <h2 className="text-xl font-bold text-brown-900 mb-4 flex items-center gap-2">
                    <Calendar size={24} />
                    Rental Period
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="pickupDate">Pickup Date *</Label>
                      <DatePicker
                        selected={pickupDate}
                        onChange={setPickupDate}
                        dateFormat="MMMM d, yyyy"
                        minDate={new Date()}
                        filterDate={filterDate}
                        renderDayContents={renderDayContents}
                        className="w-full px-4 py-2 border border-brown-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-600"
                        placeholderText="Select pickup date"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="pickupTime">Pickup Time *</Label>
                      <Input
                        type="time"
                        id="pickupTime"
                        name="pickupTime"
                        value={formData.pickupTime}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="returnDate">Return Date *</Label>
                      <DatePicker
                        selected={returnDate}
                        onChange={setReturnDate}
                        dateFormat="MMMM d, yyyy"
                        minDate={pickupDate || new Date()}
                        filterDate={filterDate}
                        renderDayContents={renderDayContents}
                        className="w-full px-4 py-2 border border-brown-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-600"
                        placeholderText="Select return date"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="returnTime">Return Time *</Label>
                      <Input
                        type="time"
                        id="returnTime"
                        name="returnTime"
                        value={formData.returnTime}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  {rentalDays > 0 && (
                    <p className="mt-2 text-sm text-brown-600 flex items-center gap-1">
                      <Clock size={16} />
                      Rental duration: {rentalDays} {rentalDays === 1 ? 'day' : 'days'}
                    </p>
                  )}
                </div>

                {/* Personal Information */}
                <div>
                  <h2 className="text-xl font-bold text-brown-900 mb-4 flex items-center gap-2">
                    <User size={24} />
                    Personal Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Juan Dela Cruz"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="juan@example.com"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="09XX XXX XXXX"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="licenseNumber">Driver's License Number *</Label>
                      <Input
                        type="text"
                        id="licenseNumber"
                        name="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={handleInputChange}
                        placeholder="N00-00-000000"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="address">Complete Address *</Label>
                      <Input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Street, Barangay, City, Province"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div>
                  <h2 className="text-xl font-bold text-brown-900 mb-4 flex items-center gap-2">
                    <Phone size={24} />
                    Emergency Contact
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="emergencyContact">Contact Name</Label>
                      <Input
                        type="text"
                        id="emergencyContact"
                        name="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={handleInputChange}
                        placeholder="Emergency contact person"
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergencyPhone">Contact Phone</Label>
                      <Input
                        type="tel"
                        id="emergencyPhone"
                        name="emergencyPhone"
                        value={formData.emergencyPhone}
                        onChange={handleInputChange}
                        placeholder="09XX XXX XXXX"
                      />
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
                  <Textarea
                    id="specialRequests"
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleInputChange}
                    placeholder="Any special requests or notes..."
                    rows={3}
                  />
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/vehicles')}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading || rentalDays <= 0}
                    className="flex-1 bg-brown-600 hover:bg-brown-700 text-white"
                  >
                    {loading ? 'Processing...' : 'Confirm Rental'}
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <h2 className="text-xl font-bold text-brown-900 mb-4">
                Rental Summary
              </h2>

              {/* Vehicle Info */}
              <div className="mb-6">
                {vehicle.images && vehicle.images.length > 0 && (
                  <img
                    src={vehicle.images[0].url}
                    alt={vehicle.name}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />
                )}
                <h3 className="text-lg font-bold text-brown-900">{vehicle.name}</h3>
                <p className="text-sm text-brown-600">
                  {vehicle.type} • {vehicle.capacity}{' '}
                  {vehicle.type === 'Motorcycle' ? 'helmets' : 'seats'}
                </p>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 border-t border-brown-200 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-brown-600">Daily Rate</span>
                  <span className="font-semibold text-brown-900">
                    ₱{vehicle.pricePerDay.toLocaleString()}/day
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-brown-600">Rental Duration</span>
                  <span className="font-semibold text-brown-900">
                    {rentalDays} {rentalDays === 1 ? 'day' : 'days'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-brown-600">Rental Cost</span>
                  <span className="font-semibold text-brown-900">
                    ₱{totalCost.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm border-t border-brown-200 pt-3">
                  <span className="text-brown-600">Security Deposit</span>
                  <span className="font-semibold text-brown-900">
                    ₱{securityDeposit.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-brown-200 pt-3">
                  <span className="text-brown-900">Total Amount</span>
                  <span className="text-brown-900">
                    ₱{(totalCost + securityDeposit).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Important Notes */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="text-sm font-bold text-blue-900 mb-2">
                  Important Notes:
                </h4>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• Security deposit is refundable upon return</li>
                  <li>• Vehicle must be returned with full tank</li>
                  <li>• Valid driver's license required</li>
                  <li>• Payment due on pickup</li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleCheckoutPage;
