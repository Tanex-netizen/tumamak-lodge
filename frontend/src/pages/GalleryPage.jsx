import { useEffect, useState, useCallback } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import useGalleryStore from '../store/galleryStore';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

const GalleryPage = () => {
  const { images, loading, error, fetchGalleryImages } = useGalleryStore();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const categories = [
    { value: 'all', label: 'All' },
    { value: 'rooms', label: 'Rooms' },
    { value: 'facilities', label: 'Facilities' },
    { value: 'dining', label: 'Dining' },
    { value: 'exterior', label: 'Exterior' },
    { value: 'activities', label: 'Activities' },
    { value: 'other', label: 'Other' },
  ];

  useEffect(() => {
    const category = selectedCategory === 'all' ? '' : selectedCategory;
    fetchGalleryImages(category);
  }, [selectedCategory, fetchGalleryImages]);

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'unset';
  };

  const goToNext = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goToPrevious = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const handleKeyDown = useCallback((e) => {
    if (!lightboxOpen) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') goToNext();
    if (e.key === 'ArrowLeft') goToPrevious();
  }, [lightboxOpen, goToNext, goToPrevious]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

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
            Gallery
          </Motion.h1>
          <p className="text-brown-200 text-lg">
            Explore our beautiful lodge, rooms, and surroundings
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {categories.map((cat) => (
            <Button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              variant={selectedCategory === cat.value ? 'default' : 'outline'}
              className={
                selectedCategory === cat.value
                  ? 'bg-brown-600 hover:bg-brown-700 text-white'
                  : 'text-brown-700 border-brown-300 hover:bg-brown-100'
              }
            >
              {cat.label}
            </Button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-brown-600 border-r-transparent"></div>
            <p className="mt-4 text-brown-700">Loading gallery...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Gallery Grid */}
        {!loading && !error && images.length > 0 && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {images.map((image, index) => (
              <Motion.div
                key={image._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className="relative group cursor-pointer"
                onClick={() => openLightbox(index)}
              >
                <div className="aspect-square overflow-hidden rounded-lg shadow-md">
                  <img
                    src={image.image.url}
                    alt={image.title || 'Gallery image'}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                    <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={32} />
                  </div>
                </div>
                {/* Image Title */}
                {image.title && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-sm font-semibold truncate">
                      {image.title}
                    </p>
                    {image.category && (
                      <p className="text-brown-200 text-xs">{image.category}</p>
                    )}
                  </div>
                )}
              </Motion.div>
            ))}
          </Motion.div>
        )}

        {/* Empty State */}
        {!loading && !error && images.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🖼️</div>
            <p className="text-brown-600 text-lg">
              No images found in this category
            </p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && images.length > 0 && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white hover:text-brown-300 transition-colors z-50"
            >
              <X size={32} />
            </button>

            {/* Previous Button */}
            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-4 text-white hover:text-brown-300 transition-colors z-50"
              >
                <ChevronLeft size={48} />
              </button>
            )}

            {/* Image Container */}
            <Motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="max-w-7xl max-h-[90vh] mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[currentImageIndex]?.image.url}
                alt={images[currentImageIndex]?.title || 'Gallery image'}
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
              />
              
              {/* Image Info */}
              <div className="text-center mt-4 text-white">
                {images[currentImageIndex]?.title && (
                  <h3 className="text-xl font-bold mb-1">
                    {images[currentImageIndex].title}
                  </h3>
                )}
                {images[currentImageIndex]?.description && (
                  <p className="text-brown-300 mb-2">
                    {images[currentImageIndex].description}
                  </p>
                )}
                <p className="text-brown-400 text-sm">
                  {currentImageIndex + 1} / {images.length}
                </p>
              </div>
            </Motion.div>

            {/* Next Button */}
            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-4 text-white hover:text-brown-300 transition-colors z-50"
              >
                <ChevronRight size={48} />
              </button>
            )}
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryPage;

