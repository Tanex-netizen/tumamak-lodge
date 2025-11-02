import { create } from 'zustand';
import axios from '../lib/axios';

export const useNotificationStore = create((set, get) => ({
  counts: {
    pendingBookings: 0,
    pendingRentals: 0,
    newUsers: 0,
    unreadMessages: 0,
  },
  isLoading: false,
  error: null,

  fetchNotificationCounts: async () => {
    set({ isLoading: true, error: null });
    try {
      // Fetch all counts in parallel
      const [bookingsRes, rentalsRes, usersRes, messagesRes] = await Promise.all([
        axios.get('/bookings?status=pending').catch(() => ({ data: { data: [] } })),
        axios.get('/vehicle-rentals?status=pending').catch(() => ({ data: { data: [] } })),
        axios.get('/users?role=customer&sort=-createdAt&limit=100').catch(() => ({ data: { data: [] } })),
        axios.get('/contact-messages').catch(() => ({ data: { data: [] } })),
      ]);

      // Count pending bookings
      const bookings = bookingsRes.data?.data || [];
      const pendingBookings = Array.isArray(bookings) 
        ? bookings.filter(b => b.status === 'pending').length 
        : 0;

      // Count pending rentals
      const rentals = rentalsRes.data?.data || [];
      const pendingRentals = Array.isArray(rentals) 
        ? rentals.filter(r => r.status === 'pending').length 
        : 0;

      // Count new users (last 7 days)
      const users = usersRes.data?.data || [];
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const newUsers = Array.isArray(users)
        ? users.filter(u => new Date(u.createdAt) >= sevenDaysAgo).length
        : 0;

      // Count unread messages
      const messages = messagesRes.data?.data || [];
      const unreadMessages = Array.isArray(messages)
        ? messages.filter(m => !m.isRead).length
        : 0;

      set({
        counts: {
          pendingBookings,
          pendingRentals,
          newUsers,
          unreadMessages,
        },
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to fetch notification counts:', error);
      set({
        error: error.response?.data?.message || 'Failed to fetch notifications',
        isLoading: false,
      });
    }
  },

  clearCount: (type) => {
    const counts = { ...get().counts };
    if (counts[type] !== undefined) {
      counts[type] = 0;
      set({ counts });
    }
  },

  clearError: () => set({ error: null }),
}));
