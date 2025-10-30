import { create } from 'zustand';
import axios from '../lib/axios';

const useGalleryStore = create((set) => ({
  images: [],
  categories: [],
  loading: false,
  error: null,

  // Fetch all gallery images
  fetchGalleryImages: async (category = '') => {
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);

      const response = await axios.get(`/gallery?${params.toString()}`);
      set({ images: response.data, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch gallery images',
        loading: false,
      });
    }
  },

  // Fetch categories
  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get('/gallery/categories');
      set({ categories: response.data, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch categories',
        loading: false,
      });
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useGalleryStore;
