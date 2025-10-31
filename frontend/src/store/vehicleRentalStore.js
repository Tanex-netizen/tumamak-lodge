import { create } from 'zustand';
import axios from '../lib/axios';

const useVehicleRentalStore = create((set) => ({
  rentals: [],
  selectedRental: null,
  loading: false,
  error: null,

  // Create a new vehicle rental
  createRental: async (rentalData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post('/vehicle-rentals', rentalData);
      set({ 
        selectedRental: response.data,
        loading: false 
      });
      return { success: true, rental: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create rental';
      set({
        error: errorMessage,
        loading: false,
      });
      return { success: false, error: errorMessage };
    }
  },

  // Fetch user's rentals
  fetchMyRentals: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get('/vehicle-rentals/my-rentals');
      set({ rentals: response.data });
    } catch (error) {
      console.error('fetchMyRentals error:', error);
      set({
        error: error.response?.data?.message || 'Failed to fetch rentals',
      });
    } finally {
      set({ loading: false });
    }
  },

  // Cancel rental
  cancelRental: async (rentalId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(`/vehicle-rentals/${rentalId}/cancel`);
      // Update the rental in the local state
      set((state) => ({
        rentals: state.rentals.map((rental) =>
          rental._id === rentalId ? response.data : rental
        ),
        loading: false,
      }));
      return { success: true, rental: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to cancel rental';
      set({
        error: errorMessage,
        loading: false,
      });
      return { success: false, error: errorMessage };
    }
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Clear selected rental
  clearSelectedRental: () => set({ selectedRental: null }),
}));

export default useVehicleRentalStore;
