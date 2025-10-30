import VehicleRental from '../models/VehicleRental.js';
import Vehicle from '../models/Vehicle.js';

// @desc    Create a new vehicle rental
// @route   POST /api/vehicle-rentals
// @access  Private
export const createVehicleRental = async (req, res) => {
  try {
    const {
      vehicleId,
      pickupDate,
      returnDate,
      rentalDays,
      totalAmount,
      dailyRate,
      securityDeposit,
      contactInfo,
      specialRequests,
    } = req.body;

    // Check if vehicle exists and is available
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    if (!vehicle.isAvailable) {
      return res.status(400).json({ message: 'Vehicle is not available' });
    }

    // Calculate rental cost
    const rentalCost = dailyRate * rentalDays;

    // Create rental
    const rental = await VehicleRental.create({
      user: req.user._id,
      vehicle: vehicleId,
      pickupDate,
      returnDate,
      rentalDays,
      dailyRate,
      rentalCost,
      securityDeposit,
      totalAmount,
      contactInfo,
      specialRequests,
      status: 'pending',
      paymentStatus: 'unpaid',
    });

    const populatedRental = await VehicleRental.findById(rental._id)
      .populate('vehicle')
      .populate('user', 'name email');

    res.status(201).json(populatedRental);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all rentals for logged-in user
// @route   GET /api/vehicle-rentals/my-rentals
// @access  Private
export const getMyRentals = async (req, res) => {
  try {
    const rentals = await VehicleRental.find({ user: req.user._id })
      .populate('vehicle')
      .sort({ createdAt: -1 });

    res.json(rentals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all rentals (admin)
// @route   GET /api/vehicle-rentals
// @access  Private/Admin
export const getAllRentals = async (req, res) => {
  try {
    const { status, paymentStatus, startDate, endDate } = req.query;

    let query = {};

    if (status) {
      query.status = status;
    }

    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    if (startDate || endDate) {
      query.pickupDate = {};
      if (startDate) query.pickupDate.$gte = new Date(startDate);
      if (endDate) query.pickupDate.$lte = new Date(endDate);
    }

    const rentals = await VehicleRental.find(query)
      .populate('vehicle')
      .populate('user', 'firstName lastName email phone profileImage')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: rentals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get rental by ID
// @route   GET /api/vehicle-rentals/:id
// @access  Private
export const getRentalById = async (req, res) => {
  try {
    const rental = await VehicleRental.findById(req.params.id)
      .populate('vehicle')
      .populate('user', 'firstName lastName email phone profileImage address');

    if (!rental) {
      return res.status(404).json({ success: false, message: 'Rental not found' });
    }

    // Check if user owns the rental or is admin/staff
    if (
      rental.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin' &&
      req.user.role !== 'staff'
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, data: rental });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update rental status
// @route   PUT /api/vehicle-rentals/:id/status
// @access  Private/Admin
export const updateRentalStatus = async (req, res) => {
  try {
    const { status, actualPickupDate, actualReturnDate, damageReport, fuelLevel, notes } = req.body;

    const rental = await VehicleRental.findById(req.params.id);

    if (!rental) {
      return res.status(404).json({ success: false, message: 'Rental not found' });
    }

    if (status) rental.status = status;
    if (actualPickupDate) rental.actualPickupDate = actualPickupDate;
    if (actualReturnDate) rental.actualReturnDate = actualReturnDate;
    if (damageReport) rental.damageReport = damageReport;
    if (fuelLevel) rental.fuelLevel = fuelLevel;
    if (notes) rental.notes = notes;

    await rental.save();

    const updatedRental = await VehicleRental.findById(rental._id)
      .populate('vehicle')
      .populate('user', 'firstName lastName email phone profileImage');

    res.json({ success: true, data: updatedRental });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update rental payment status
// @route   PUT /api/vehicle-rentals/:id/payment
// @access  Private/Admin
export const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus, depositReturned } = req.body;

    const rental = await VehicleRental.findById(req.params.id);

    if (!rental) {
      return res.status(404).json({ success: false, message: 'Rental not found' });
    }

    if (paymentStatus !== undefined) {
      rental.paymentStatus = paymentStatus;
    }
    if (depositReturned !== undefined) {
      rental.depositReturned = depositReturned;
    }

    await rental.save();

    const updatedRental = await VehicleRental.findById(rental._id)
      .populate('vehicle')
      .populate('user', 'firstName lastName email phone profileImage');

    res.json({ success: true, data: updatedRental });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel rental
// @route   PUT /api/vehicle-rentals/:id/cancel
// @access  Private
export const cancelRental = async (req, res) => {
  try {
    const rental = await VehicleRental.findById(req.params.id);

    if (!rental) {
      return res.status(404).json({ message: 'Rental not found' });
    }

    // Check if user owns the rental
    if (rental.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Can only cancel pending or confirmed rentals
    if (rental.status !== 'pending' && rental.status !== 'confirmed') {
      return res.status(400).json({ message: 'Cannot cancel this rental' });
    }

    rental.status = 'cancelled';
    await rental.save();

    const updatedRental = await VehicleRental.findById(rental._id)
      .populate('vehicle')
      .populate('user', 'name email phone');

    res.json(updatedRental);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete rental
// @route   DELETE /api/vehicle-rentals/:id
// @access  Private/Admin
export const deleteRental = async (req, res) => {
  try {
    const rental = await VehicleRental.findById(req.params.id);

    if (!rental) {
      return res.status(404).json({ message: 'Rental not found' });
    }

    await rental.deleteOne();

    res.json({ message: 'Rental deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
