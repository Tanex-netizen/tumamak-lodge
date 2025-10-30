import { create } from 'zustand';
import axios from '../lib/axios';

const useBookingStore = create((set) => ({
  bookings: [],
  loading: false,
  error: null,

  // Fetch all bookings with optional filters
  fetchBookings: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams();
      
      if (filters.status) params.append('status', filters.status);
      if (filters.paymentStatus) params.append('paymentStatus', filters.paymentStatus);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.search) params.append('search', filters.search);

      const response = await axios.get(`/bookings?${params.toString()}`);
      set({ bookings: response.data.data || [], loading: false });
    } catch (error) {
      set({ 
        bookings: [],
        error: error.response?.data?.message || 'Failed to fetch bookings', 
        loading: false 
      });
    }
  },

  // Update booking status
  updateBookingStatus: async (bookingId, status) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(`/bookings/${bookingId}/status`, { status });
      
      set((state) => ({
        bookings: state.bookings.map((booking) =>
          booking._id === bookingId ? (response.data.data || response.data) : booking
        ),
        loading: false,
      }));
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update booking status';
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Update payment status
  updatePaymentStatus: async (bookingId, paymentStatus) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(`/bookings/${bookingId}/payment`, { paymentStatus });
      
      set((state) => ({
        bookings: state.bookings.map((booking) =>
          booking._id === bookingId ? (response.data.data || response.data) : booking
        ),
        loading: false,
      }));
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update payment status';
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Get booking details
  getBookingDetails: async (bookingId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`/bookings/${bookingId}`);
      set({ loading: false });
      return response.data.data || response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch booking details', 
        loading: false 
      });
      return null;
    }
  },
}));

export default useBookingStore;
