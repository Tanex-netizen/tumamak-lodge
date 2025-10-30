import { create } from 'zustand';
import axios from '../lib/axios';

const useVehicleStore = create((set) => ({
  vehicles: [],
  selectedVehicle: null,
  loading: false,
  error: null,

  // Fetch all vehicles
  fetchVehicles: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (filters.type) params.append('type', filters.type);
      if (filters.availability === 'Available') params.append('isAvailable', 'true');
      if (filters.availability === 'Unavailable') params.append('isAvailable', 'false');

      const response = await axios.get(`/vehicles?${params.toString()}`);
      // Backend returns vehicles array directly, not wrapped in an object
      set({ vehicles: response.data, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch vehicles',
        loading: false,
      });
    }
  },

  // Fetch single vehicle
  fetchVehicleById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`/vehicles/${id}`);
      // Backend returns vehicle directly, not wrapped in an object
      set({ selectedVehicle: response.data, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch vehicle',
        loading: false,
      });
    }
  },

  // Clear selected vehicle
  clearSelectedVehicle: () => set({ selectedVehicle: null }),

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useVehicleStore;
