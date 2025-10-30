import { create } from 'zustand';
import axios from '../lib/axios';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.post('/auth/login', { email, password });
      
      // Backend returns user data directly with token property
      // Check if user is admin
      if (data.role !== 'admin') {
        set({ error: 'Access denied. Admin privileges required.', isLoading: false });
        return;
      }

      const token = data.token;
      const user = {
        _id: data._id,
        name: `${data.firstName} ${data.lastName}`,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        profileImage: data.profileImage,
        role: data.role,
      };

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, token, isLoading: false });
      return { success: true };
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Login failed',
        isLoading: false,
      });
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
    window.location.href = '/login';
  },

  clearError: () => set({ error: null }),
}));
