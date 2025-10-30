import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/axios';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email, password) => {
        try {
          const { data } = await api.post('/auth/login', { email, password });
          localStorage.setItem('token', data.token);
          set({
            user: data,
            token: data.token,
            isAuthenticated: true,
          });
          return { success: true };
        } catch (error) {
          return {
            success: false,
            error: error.response?.data?.message || 'Login failed',
          };
        }
      },

      register: async (userData) => {
        try {
          const { data } = await api.post('/auth/register', userData);
          localStorage.setItem('token', data.token);
          set({
            user: data,
            token: data.token,
            isAuthenticated: true,
          });
          return { success: true };
        } catch (error) {
          return {
            success: false,
            error: error.response?.data?.message || 'Registration failed',
          };
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      updateProfile: async (formData) => {
        try {
          const { data } = await api.put('/auth/profile', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          set((state) => ({
            user: { ...state.user, ...data },
          }));
          return { success: true };
        } catch (error) {
          return {
            success: false,
            error: error.response?.data?.message || 'Update failed',
          };
        }
      },

      fetchUser: async () => {
        try {
          const { data } = await api.get('/auth/me');
          set((state) => ({
            user: { ...state.user, ...data },
          }));
        } catch (error) {
          console.error('Failed to fetch user:', error);
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
