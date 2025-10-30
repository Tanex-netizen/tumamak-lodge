import { create } from 'zustand';
import api from '../lib/axios';

export const useBookingStore = create((set) => ({
  bookings: [],
  selectedBooking: null,
  loading: false,
  error: null,

  createBooking: async (bookingData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/bookings', bookingData);
      set((state) => ({
        bookings: [data, ...state.bookings],
        loading: false,
      }));
      return { success: true, booking: data };
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || 'Failed to create booking';
      set({ error: errorMsg, loading: false });
      return { success: false, error: errorMsg };
    }
  },

  fetchMyBookings: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get('/bookings/my-bookings');
      set({ bookings: data, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch bookings',
        loading: false,
      });
    }
  },

  fetchBookingById: async (id) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get(`/bookings/${id}`);
      set({ selectedBooking: data, loading: false });
      return data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch booking',
        loading: false,
      });
    }
  },

  cancelBooking: async (id, reason) => {
    try {
      const { data } = await api.put(`/bookings/${id}/cancel`, {
        cancellationReason: reason,
      });
      set((state) => ({
        bookings: state.bookings.map((booking) =>
          booking._id === id ? data : booking
        ),
      }));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to cancel booking',
      };
    }
  },
}));
