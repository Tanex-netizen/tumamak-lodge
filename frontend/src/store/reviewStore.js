import { create } from 'zustand';
import api from '../lib/axios';

export const useReviewStore = create((set) => ({
  reviews: [],
  loading: false,
  error: null,

  createReview: async (reviewData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/reviews', reviewData);
      set((state) => ({
        reviews: [data, ...state.reviews],
        loading: false,
      }));
      return { success: true, review: data };
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || 'Failed to create review';
      set({ error: errorMsg, loading: false });
      return { success: false, error: errorMsg };
    }
  },

  fetchRoomReviews: async (roomId) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get(`/reviews/room/${roomId}`);
      set({ reviews: data, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch reviews',
        loading: false,
      });
    }
  },
}));
