import { create } from 'zustand';
import axios from '../lib/axios';

const useUserStore = create((set) => ({
  users: [],
  loading: false,
  error: null,

  // Fetch all users with optional filters
  fetchUsers: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams();
      
      if (filters.role) params.append('role', filters.role);
      if (filters.isActive !== undefined) params.append('isActive', filters.isActive);
      if (filters.search) params.append('search', filters.search);

      const response = await axios.get(`/users?${params.toString()}`);
      set({ users: response.data.data || [], loading: false });
    } catch (error) {
      set({ 
        users: [],
        error: error.response?.data?.message || 'Failed to fetch users', 
        loading: false 
      });
    }
  },

  // Update user role
  updateUserRole: async (userId, role) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.patch(`/users/${userId}/role`, { role });
      
      set((state) => ({
        users: state.users.map((user) =>
          user._id === userId ? response.data.data : user
        ),
        loading: false,
      }));
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update user role';
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Toggle user active status
  toggleUserStatus: async (userId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.patch(`/users/${userId}/toggle-status`);
      
      set((state) => ({
        users: state.users.map((user) =>
          user._id === userId ? response.data.data : user
        ),
        loading: false,
      }));
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to toggle user status';
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Get user details
  getUserDetails: async (userId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`/users/${userId}`);
      set({ loading: false });
      return response.data.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch user details', 
        loading: false 
      });
      return null;
    }
  },
}));

export default useUserStore;
