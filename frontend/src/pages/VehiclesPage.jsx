import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import useVehicleStore from '../store/vehicleStore';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { X, Check } from 'lucide-react';

const VehiclesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { vehicles, loading, error, fetchVehicles } = useVehicleStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedAvailability, setSelectedAvailability] = useState('Available');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  useEffect(() => {
    const filters = {};
    if (selectedType !== 'All Types') filters.type = selectedType;
    if (selectedAvailability !== 'All') filters.availability = selectedAvailability;
    fetchVehicles(filters);
  }, [selectedType, selectedAvailability, fetchVehicles]);

  const handleQuickRent = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowTermsModal(true);
    setAcceptedTerms(false);
  };

  const handleConfirmRental = () => {
    if (!acceptedTerms) {
      alert('Please accept the terms and conditions to continue');
      return;
    }
    
    // Check if user is logged in
    if (!user) {
      alert('Please login to continue with the rental');
      navigate('/login');
      return;
    }
    
    // Navigate to checkout page with vehicle data
    setShowTermsModal(false);
    navigate('/vehicle-checkout', { state: { vehicle: selectedVehicle } });
    setSelectedVehicle(null);
    setAcceptedTerms(false);
  };

  const filteredVehicles = (vehicles || []).filter((vehicle) =>
    vehicle.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const vehicleTypes = ['All Types', 'Motorcycle', 'Car', 'Van', 'SUV'];
  const transmissionTypes = ['Any trans.'];

  return (
    <div className="min-h-screen bg-brown-50">
      {/* Header Section */}
      <div className="bg-brown-900 text-white py-16">
        <div className="container mx-auto px-4">
          <Motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Rentals
          </Motion.h1>
          <p className="text-brown-200 text-lg">
            Motorcycle and car rentals. Filter by availability, type, transmission, and price.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search Input */}
            <div className="md:col-span-1">
              <Input
                type="text"
                placeholder="Search rentals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Type Filter */}
            <div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-brown-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brown-500"
              >
                {vehicleTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Availability Filter */}
            <div>
              <select
                value={selectedAvailability}
                onChange={(e) => setSelectedAvailability(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-brown-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brown-500"
              >
                <option value="All">All Status</option>
                <option value="Available">Available</option>
                <option value="Unavailable">Unavailable</option>
              </select>
            </div>

            {/* Transmission Filter */}
            <div>
              <select
                className="w-full h-10 px-3 rounded-md border border-brown-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brown-500"
              >
                {transmissionTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Filters */}
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min price"
                className="w-full"
              />
              <Input
                type="number"
                placeholder="Max price"
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-brown-600 border-r-transparent"></div>
            <p className="mt-4 text-brown-700">Loading vehicles...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Vehicles Grid */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredVehicles.map((vehicle, index) => (
                <Motion.div
                  key={vehicle._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    {/* Vehicle Image */}
                    <div className="relative h-48 bg-brown-100">
                      {vehicle.images && vehicle.images.length > 0 ? (
                        <img
                          src={vehicle.images[0].url}
                          alt={vehicle.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-brown-400">
                          No Image
                        </div>
                      )}
                      {vehicle.isAvailable && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                          <Check size={12} />
                          Available
                        </div>
                      )}
                    </div>

                    {/* Vehicle Info */}
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-brown-900 mb-2">
                        {vehicle.name}
                      </h3>
                      <p className="text-sm text-brown-600 mb-3">
                        {vehicle.type} • {vehicle.capacity} {vehicle.type === 'Motorcycle' ? 'helmets' : 'seats'}
                      </p>

                      {/* Price */}
                      <div className="mb-4">
                        <div className="text-2xl font-bold text-brown-800">
                          ₱{vehicle.pricePerDay.toLocaleString()}/day
                        </div>
                        {vehicle.isAvailable && (
                          <div className="text-sm text-green-600 font-medium">
                            ✓ Available
                          </div>
                        )}
                      </div>

                      {/* Quick Rent Button */}
                      <Button
                        onClick={() => handleQuickRent(vehicle)}
                        disabled={!vehicle.isAvailable}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        ✓ Quick Rent
                      </Button>
                    </div>
                  </Card>
                </Motion.div>
              ))}
            </div>

            {/* No Results */}
            {filteredVehicles.length === 0 && (
              <div className="text-center py-12">
                <p className="text-brown-600 text-lg">
                  No vehicles found matching your criteria.
                </p>
              </div>
            )}

            {/* Pagination */}
            {filteredVehicles.length > 0 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <span className="text-brown-700">Page 1 / 1</span>
                <select className="px-3 py-1 border border-brown-200 rounded-md text-sm">
                  <option>20/page</option>
                  <option>50/page</option>
                  <option>100/page</option>
                </select>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled>
                    Prev
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Terms and Conditions Modal */}
      {showTermsModal && selectedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Modal Header */}
            <div className="bg-brown-800 text-white p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Rental Agreement</h2>
              <button
                onClick={() => {
                  setShowTermsModal(false);
                  setSelectedVehicle(null);
                  setAcceptedTerms(false);
                }}
                className="text-white hover:text-brown-200"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {/* Vehicle Info */}
              <div className="mb-6 p-4 bg-brown-50 rounded-lg">
                <div className="flex items-center gap-4">
                  {selectedVehicle.images && selectedVehicle.images.length > 0 && (
                    <img
                      src={selectedVehicle.images[0].url}
                      alt={selectedVehicle.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-brown-900">
                      {selectedVehicle.name}
                    </h3>
                    <p className="text-brown-600">
                      {selectedVehicle.type} • {selectedVehicle.capacity} {selectedVehicle.type === 'Motorcycle' ? 'helmets' : 'seats'}
                    </p>
                    <p className="text-2xl font-bold text-brown-800 mt-1">
                      ₱{selectedVehicle.pricePerDay.toLocaleString()}/day
                    </p>
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-brown-900">
                  Terms and Conditions
                </h3>

                <div className="space-y-3 text-sm text-brown-700">
                  <div>
                    <h4 className="font-semibold text-brown-900 mb-1">1. Rental Period</h4>
                    <p>The rental period begins and ends at the times specified in the rental agreement. Late returns may incur additional charges at the daily rate.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-brown-900 mb-1">2. Driver Requirements</h4>
                    <p>The renter must possess a valid driver's license appropriate for the vehicle type. For motorcycles, a motorcycle license is required. Minimum age requirement: 21 years old for cars, 18 years old for motorcycles.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-brown-900 mb-1">3. Vehicle Condition</h4>
                    <p>The vehicle must be returned in the same condition as received. Any damage, loss, or theft must be reported immediately. You are responsible for all damages that occur during your rental period.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-brown-900 mb-1">4. Payment Terms</h4>
                    <p>Full payment is required before vehicle release. A security deposit of ₱5,000 (motorcycles) or ₱10,000 (cars) is required and will be refunded upon return if no damages occur.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-brown-900 mb-1">5. Insurance and Liability</h4>
                    <p>Basic insurance is included. However, renter is liable for the first ₱10,000 of any damages. Additional insurance options are available at extra cost.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-brown-900 mb-1">6. Fuel Policy</h4>
                    <p>Vehicle is provided with a full tank and must be returned with a full tank. Failure to do so will result in refueling charges plus a service fee.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-brown-900 mb-1">7. Prohibited Uses</h4>
                    <p>The vehicle may not be used for: racing, towing, off-road driving (unless specified), illegal activities, or outside the agreed service area without prior authorization.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-brown-900 mb-1">8. Cancellation Policy</h4>
                    <p>Cancellations made 24 hours before rental time: full refund. Cancellations within 24 hours: 50% refund. No-shows: no refund.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-brown-900 mb-1">9. Maintenance Issues</h4>
                    <p>If mechanical issues arise during rental, contact us immediately. Do not attempt repairs without authorization. We will provide roadside assistance or replacement vehicle when possible.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-brown-900 mb-1">10. Agreement</h4>
                    <p>By accepting these terms, you acknowledge that you have read, understood, and agree to all terms and conditions outlined above. You also confirm that all information provided is accurate and complete.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-brown-200 p-6 bg-brown-50">
              <div className="mb-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-1 h-5 w-5 text-brown-600 border-brown-300 rounded focus:ring-brown-500"
                  />
                  <span className="text-sm text-brown-900">
                    I have read and agree to the terms and conditions outlined above. I understand that I am responsible for the vehicle during the rental period.
                  </span>
                </label>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setShowTermsModal(false);
                    setSelectedVehicle(null);
                    setAcceptedTerms(false);
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmRental}
                  disabled={!acceptedTerms}
                  className="flex-1 bg-brown-600 hover:bg-brown-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Confirm Rental
                </Button>
              </div>
            </div>
          </Motion.div>
        </div>
      )}
    </div>
  );
};

export default VehiclesPage;
