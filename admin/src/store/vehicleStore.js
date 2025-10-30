import { create } from 'zustand';
import axios from '../lib/axios';

const useVehicleStore = create((set) => ({
  vehicles: [],
  rentals: [],
  loading: false,
  error: null,

  // Fetch all vehicles
  fetchVehicles: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams();
      
      if (filters.type) params.append('type', filters.type);
      if (filters.isAvailable !== undefined) params.append('isAvailable', filters.isAvailable);

      const response = await axios.get(`/vehicles?${params.toString()}`);
      set({ vehicles: response.data || [], loading: false });
    } catch (error) {
      set({ 
        vehicles: [],
        error: error.response?.data?.message || 'Failed to fetch vehicles', 
        loading: false 
      });
    }
  },

  // Fetch all vehicle rentals
  fetchRentals: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams();
      
      if (filters.status) params.append('status', filters.status);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.search) params.append('search', filters.search);

      const response = await axios.get(`/vehicle-rentals?${params.toString()}`);
      set({ rentals: response.data.data || response.data || [], loading: false });
    } catch (error) {
      set({ 
        rentals: [],
        error: error.response?.data?.message || 'Failed to fetch rentals', 
        loading: false 
      });
    }
  },

  // Update rental status
  updateRentalStatus: async (rentalId, status) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(`/vehicle-rentals/${rentalId}/status`, { status });
      
      set((state) => ({
        rentals: state.rentals.map((rental) =>
          rental._id === rentalId ? (response.data.data || response.data) : rental
        ),
        loading: false,
      }));
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update rental status';
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Update payment status
  updatePaymentStatus: async (rentalId, paymentStatus, depositReturned) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(`/vehicle-rentals/${rentalId}/payment`, { 
        paymentStatus,
        depositReturned 
      });
      
      set((state) => ({
        rentals: state.rentals.map((rental) =>
          rental._id === rentalId ? (response.data.data || response.data) : rental
        ),
        loading: false,
      }));
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update payment status';
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Get rental details
  getRentalDetails: async (rentalId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`/vehicle-rentals/${rentalId}`);
      set({ loading: false });
      return response.data.data || response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch rental details', 
        loading: false 
      });
      return null;
    }
  },

  // Create vehicle
  createVehicle: async (vehicleData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post('/vehicles', vehicleData);
      set((state) => ({
        vehicles: [response.data, ...state.vehicles],
        loading: false,
      }));
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create vehicle';
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Update vehicle
  updateVehicle: async (vehicleId, vehicleData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(`/vehicles/${vehicleId}`, vehicleData);
      set((state) => ({
        vehicles: state.vehicles.map((vehicle) =>
          vehicle._id === vehicleId ? response.data : vehicle
        ),
        loading: false,
      }));
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update vehicle';
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Delete vehicle
  deleteVehicle: async (vehicleId) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`/vehicles/${vehicleId}`);
      set((state) => ({
        vehicles: state.vehicles.filter((vehicle) => vehicle._id !== vehicleId),
        loading: false,
      }));
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete vehicle';
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },
}));

export default useVehicleStore;
