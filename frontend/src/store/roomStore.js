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
      // Add cache-busting parameter to force fresh data
      const params = { ...filters, _t: Date.now() };
      const { data } = await api.get('/rooms', { params });
      console.log('fetchRooms response:', data);
      set({ rooms: data });
    } catch (error) {
      console.error('fetchRooms error:', error);
      set({
        error: error.response?.data?.message || 'Failed to fetch rooms',
      });
    } finally {
      set({ loading: false });
    }
  },

  fetchRoomById: async (id) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get(`/rooms/${id}`);
      // Backend returns { room, reviews }, so we need to extract just the room
      const roomData = data.room || data;
      set({ selectedRoom: roomData });
      return roomData;
    } catch (error) {
      console.error('fetchRoomById error:', error);
      set({
        error: error.response?.data?.message || 'Failed to fetch room',
      });
    } finally {
      set({ loading: false });
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
