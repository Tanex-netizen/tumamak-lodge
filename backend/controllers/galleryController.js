import Gallery from '../models/Gallery.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryHelper.js';

// @desc    Get all gallery images
// @route   GET /api/gallery
// @access  Public
export const getGalleryImages = async (req, res) => {
  try {
    const { category, isActive } = req.query;

    let query = {};

    if (category) {
      query.category = category;
    }

    if (typeof isActive !== 'undefined') {
      query.isActive = isActive === 'true';
    } else {
      query.isActive = true; // Default to showing only active images for public
    }

    const images = await Gallery.find(query).sort({ createdAt: -1 });

    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get gallery image by ID
// @route   GET /api/gallery/:id
// @access  Public
export const getGalleryImageById = async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);

    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    res.json(image);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload gallery image
// @route   POST /api/gallery
// @access  Private/Admin
export const uploadGalleryImage = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    const result = await uploadToCloudinary(
      req.file.buffer,
      'tumamak-lodge/gallery'
    );

    const galleryImage = await Gallery.create({
      title,
      description,
      category,
      image: {
        url: result.url,
        public_id: result.public_id,
      },
    });

    res.status(201).json(galleryImage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update gallery image
// @route   PUT /api/gallery/:id
// @access  Private/Admin
export const updateGalleryImage = async (req, res) => {
  try {
    const galleryImage = await Gallery.findById(req.params.id);

    if (!galleryImage) {
      return res.status(404).json({ message: 'Image not found' });
    }

    const { title, description, category, isActive } = req.body;

    if (title) galleryImage.title = title;
    if (description) galleryImage.description = description;
    if (category) galleryImage.category = category;
    if (typeof isActive !== 'undefined') galleryImage.isActive = isActive;

    // If new image is uploaded
    if (req.file) {
      // Delete old image from cloudinary
      await deleteFromCloudinary(galleryImage.image.public_id);

      // Upload new image
      const result = await uploadToCloudinary(
        req.file.buffer,
        'tumamak-lodge/gallery'
      );

      galleryImage.image = {
        url: result.url,
        public_id: result.public_id,
      };
    }

    const updatedImage = await galleryImage.save();
    res.json(updatedImage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete gallery image
// @route   DELETE /api/gallery/:id
// @access  Private/Admin
export const deleteGalleryImage = async (req, res) => {
  try {
    const galleryImage = await Gallery.findById(req.params.id);

    if (!galleryImage) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Delete from cloudinary
    await deleteFromCloudinary(galleryImage.image.public_id);

    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
