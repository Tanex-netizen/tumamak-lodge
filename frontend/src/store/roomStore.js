import { create } from 'zustand';
import api from '../lib/axios';

export const useRoomStore = create((set) => ({
  rooms: [],
  selectedRoom: null,
  bookedDates: [],
  loading: false,
  error: null,

  fetchRooms: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get('/api/rooms', { params: filters });
      set({ rooms: data, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch rooms',
        loading: false,
      });
    }
  },

  fetchRoomById: async (id) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get(`/rooms/${id}`);
      // Backend returns { room, reviews }, so we need to extract just the room
      const roomData = data.room || data;
      set({ selectedRoom: roomData, loading: false });
      return roomData;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch room',
        loading: false,
      });
    }
  },

  fetchBookedDates: async (roomId) => {
    try {
      const { data } = await api.get(`/bookings/room/${roomId}/booked-dates`);
      // data.data contains array of date strings like ["2025-10-18", "2025-10-19"]
      set({ bookedDates: data.data || [] });
      return data.data || [];
    } catch (error) {
      console.error('Failed to fetch booked dates:', error);
      set({ bookedDates: [] });
      return [];
    }
  },

  checkAvailability: async (roomId, checkInDate, checkOutDate) => {
    try {
      const { data } = await api.post('/rooms/check-availability', {
        roomId,
        checkInDate,
        checkOutDate,
      });
      return data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to check availability'
      );
    }
  },

  getBookedDates: async (roomId) => {
    try {
      const { data } = await api.get(`/bookings/room/${roomId}/booked-dates`);
      return data.data || [];
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch booked dates'
      );
    }
  },
}));
