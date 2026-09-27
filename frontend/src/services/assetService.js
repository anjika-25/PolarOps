import api from './api';

export const assetService = {
  getAssets: async (filters = {}) => {
    const params = {};
    if (filters.location && filters.location.trim()) {
      params.location = filters.location.trim();
    }
    if (filters.condition && filters.condition.trim()) {
      params.condition = filters.condition.trim();
    }
    if (filters.maintenance_status && filters.maintenance_status.trim()) {
      params.maintenance_status = filters.maintenance_status.trim();
    }
    if (filters.status && filters.status.trim()) {
      params.status = filters.status.trim();
    }

    const response = await api.get('/assets', { params });
    return response.data;
  },

  getAssetById: async (assetId) => {
    const response = await api.get(`/assets/${assetId}`);
    return response.data;
  }
};
