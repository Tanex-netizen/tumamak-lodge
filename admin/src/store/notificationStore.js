import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from '../lib/axios';

export const useNotificationStore = create(
  persist(
    (set, get) => ({
      counts: {
        pendingBookings: 0,
        pendingRentals: 0,
        newUsers: 0,
        unreadMessages: 0,
      },
      lastViewed: {
        bookings: null,
        vehicleRentals: null,
        users: null,
        contacts: null,
      },
      isLoading: false,
      error: null,

      fetchNotificationCounts: async () => {
        set({ isLoading: true, error: null });
        try {
          const { lastViewed } = get();
          
          // Fetch all counts in parallel
          const [bookingsRes, rentalsRes, usersRes, messagesRes] = await Promise.all([
            axios.get('/bookings?status=pending').catch(() => ({ data: { data: [] } })),
            axios.get('/vehicle-rentals?status=pending').catch(() => ({ data: { data: [] } })),
            axios.get('/users?role=customer&sort=-createdAt&limit=100').catch(() => ({ data: { data: [] } })),
            axios.get('/contact-messages').catch(() => ({ data: { data: [] } })),
          ]);

          // Count pending bookings created after last view
          const bookings = bookingsRes.data?.data || [];
          const pendingBookings = Array.isArray(bookings) 
            ? bookings.filter(b => {
                if (b.status !== 'pending') return false;
                if (!lastViewed.bookings) return true;
                return new Date(b.createdAt) > new Date(lastViewed.bookings);
              }).length 
            : 0;

          // Count pending rentals created after last view
          const rentals = rentalsRes.data?.data || [];
          const pendingRentals = Array.isArray(rentals) 
            ? rentals.filter(r => {
                if (r.status !== 'pending') return false;
                if (!lastViewed.vehicleRentals) return true;
                return new Date(r.createdAt) > new Date(lastViewed.vehicleRentals);
              }).length 
            : 0;

          // Count new users created after last view
          const users = usersRes.data?.data || [];
          const newUsers = Array.isArray(users)
            ? users.filter(u => {
                if (!lastViewed.users) return true;
                return new Date(u.createdAt) > new Date(lastViewed.users);
              }).length
            : 0;

          // Count messages with new activity after last view (either unread OR updated after last view)
          const messages = messagesRes.data?.data || [];
          const unreadMessages = Array.isArray(messages)
            ? messages.filter(m => {
                // If no last view time, count all unread or recently active
                if (!lastViewed.contacts) {
                  return !m.isRead || m.status === 'active';
                }
                // Count if: unread, OR has new messages after last view
                const lastViewTime = new Date(lastViewed.contacts);
                const lastMessageTime = new Date(m.lastMessageAt || m.updatedAt);
                return !m.isRead || lastMessageTime > lastViewTime;
              }).length
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

      markAsViewed: (section) => {
        const lastViewed = { ...get().lastViewed };
        lastViewed[section] = new Date().toISOString();
        set({ lastViewed });
        
        // Immediately update the count for this section to 0
        const counts = { ...get().counts };
        const countMap = {
          bookings: 'pendingBookings',
          vehicleRentals: 'pendingRentals',
          users: 'newUsers',
          contacts: 'unreadMessages',
        };
        if (countMap[section]) {
          counts[countMap[section]] = 0;
          set({ counts });
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
    }),
    {
      name: 'notification-storage',
      partialize: (state) => ({ lastViewed: state.lastViewed }),
    }
  )
);
