import { create } from 'zustand';
import axios from '../lib/axios';

export const useDashboardStore = create((set) => ({
  stats: null,
  recentBookings: [],
  revenueData: [],
  isLoading: false,
  error: null,

  fetchDashboardStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.get('/analytics/dashboard-stats');
      set({ stats: data.data || data, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch dashboard stats',
        isLoading: false,
      });
    }
  },

  fetchRecentBookings: async (limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.get(`/bookings?limit=${limit}&sort=-createdAt`);
      set({ recentBookings: data.data || data || [], isLoading: false });
    } catch (error) {
      set({
        recentBookings: [],
        error: error.response?.data?.message || 'Failed to fetch recent bookings',
        isLoading: false,
      });
    }
  },

  fetchRevenueData: async (startDate, endDate) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const { data } = await axios.get(`/analytics/revenue?${params}`);
      set({ revenueData: data, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch revenue data',
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
