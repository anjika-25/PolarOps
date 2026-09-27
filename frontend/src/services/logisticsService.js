import api from './api';

export const logisticsService = {
  getCargo: async (filters = {}) => {
    const params = {};
    if (filters.status && filters.status.trim()) {
      params.status = filters.status.trim();
    }
    if (filters.priority && filters.priority.trim()) {
      params.priority = filters.priority.trim();
    }
    if (filters.destination && filters.destination.trim()) {
      params.destination = filters.destination.trim();
    }

    const response = await api.get('/cargo', { params });
    return response.data;
  },

  getInventory: async (filters = {}) => {
    const params = {};
    if (filters.location && filters.location.trim()) {
      params.location = filters.location.trim();
    }
    if (filters.status && filters.status.trim()) {
      params.status = filters.status.trim();
    }

    const response = await api.get('/inventory', { params });
    return response.data;
  },

  updateInventoryQuantity: async (itemId, quantity) => {
    const response = await api.patch(`/inventory/${itemId}`, { quantity: Number(quantity) });
    return response.data;
  },

  getInventoryPrediction: async (itemId) => {
    const response = await api.get(`/inventory/${itemId}/prediction`);
    return response.data;
  }
};
