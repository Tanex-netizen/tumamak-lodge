import Vehicle from '../models/Vehicle.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryHelper.js';

// @desc    Get all vehicles
// @route   GET /api/vehicles
// @access  Public
export const getVehicles = async (req, res) => {
  try {
    const { type, isAvailable } = req.query;

    let query = {};

    if (type) {
      query.type = type;
    }

    if (typeof isAvailable !== 'undefined') {
      query.isAvailable = isAvailable === 'true';
    }

    const vehicles = await Vehicle.find(query).sort({ createdAt: -1 });

    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get vehicle by ID
// @route   GET /api/vehicles/:id
// @access  Public
export const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a vehicle
// @route   POST /api/vehicles
// @access  Private/Admin
export const createVehicle = async (req, res) => {
  try {
    const {
      name,
      type,
      description,
      pricePerDay,
      capacity,
      features,
      transmissionType,
      fuelType,
    } = req.body;

    // Handle multiple image uploads
    const images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(
          file.buffer,
          'tumamak-lodge/vehicles'
        );
        images.push(result);
      }
    }

    const vehicle = await Vehicle.create({
      name,
      type,
      description,
      pricePerDay,
      capacity,
      images,
      features,
      transmissionType,
      fuelType,
    });

    res.status(201).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a vehicle
// @route   PUT /api/vehicles/:id
// @access  Private/Admin
export const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    const {
      name,
      type,
      description,
      pricePerDay,
      capacity,
      features,
      isAvailable,
      transmissionType,
      fuelType,
    } = req.body;

    if (name) vehicle.name = name;
    if (type) vehicle.type = type;
    if (description) vehicle.description = description;
    if (pricePerDay) vehicle.pricePerDay = pricePerDay;
    if (capacity) vehicle.capacity = capacity;
    if (features) vehicle.features = features;
    if (typeof isAvailable !== 'undefined') vehicle.isAvailable = isAvailable;
    if (transmissionType) vehicle.transmissionType = transmissionType;
    if (fuelType) vehicle.fuelType = fuelType;

    // Handle new images
    if (req.files && req.files.length > 0) {
      const newImages = [];
      for (const file of req.files) {
        const result = await uploadToCloudinary(
          file.buffer,
          'tumamak-lodge/vehicles'
        );
        newImages.push(result);
      }
      vehicle.images = [...vehicle.images, ...newImages];
    }

    const updatedVehicle = await vehicle.save();
    res.json(updatedVehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a vehicle
// @route   DELETE /api/vehicles/:id
// @access  Private/Admin
export const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Delete images from cloudinary
    for (const image of vehicle.images) {
      await deleteFromCloudinary(image.public_id);
    }

    await Vehicle.findByIdAndDelete(req.params.id);
    res.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete vehicle image
// @route   DELETE /api/vehicles/:id/images/:publicId
// @access  Private/Admin
export const deleteVehicleImage = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    const publicId = req.params.publicId;

    vehicle.images = vehicle.images.filter((img) => img.public_id !== publicId);

    await deleteFromCloudinary(publicId);

    await vehicle.save();
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
