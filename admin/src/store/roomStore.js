import { create } from 'zustand';
import axios from '../lib/axios';

export const useRoomStore = create((set) => ({
  rooms: [],
  isLoading: false,
  error: null,

  fetchRooms: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.get('/rooms');
      set({ rooms: data, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch rooms',
        isLoading: false,
      });
    }
  },

  createRoom: async (roomData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.post('/rooms', roomData);
      set((state) => ({
        rooms: [...state.rooms, data],
        isLoading: false,
      }));
      return data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to create room',
        isLoading: false,
      });
      throw error;
    }
  },

  updateRoom: async (id, roomData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.put(`/rooms/${id}`, roomData);
      set((state) => ({
        rooms: state.rooms.map((room) => (room._id === id ? data : room)),
        isLoading: false,
      }));
      return data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to update room',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteRoom: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`/rooms/${id}`);
      set((state) => ({
        rooms: state.rooms.filter((room) => room._id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to delete room',
        isLoading: false,
      });
      throw error;
    }
  },

  uploadRoomImages: async (id, files) => {
    set({ isLoading: true, error: null });
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('images', file);
      });

      const { data } = await axios.post(`/rooms/${id}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      set((state) => ({
        rooms: state.rooms.map((room) => (room._id === id ? data : room)),
        isLoading: false,
      }));
      return data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to upload images',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteRoomImage: async (roomId, imagePublicId) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.delete(`/rooms/${roomId}/images/${imagePublicId}`);
      set((state) => ({
        rooms: state.rooms.map((room) => (room._id === roomId ? data : room)),
        isLoading: false,
      }));
      return data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to delete image',
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
