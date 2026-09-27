import api from './api';

export const personnelService = {
  getPersonnel: async (filters = {}) => {
    const params = {};
    if (filters.expedition_id) {
      params.expedition_id = filters.expedition_id;
    }
    if (filters.location && filters.location.trim()) {
      params.location = filters.location.trim();
    }
    if (filters.status && filters.status.trim()) {
      params.status = filters.status.trim();
    }

    const response = await api.get('/personnel', { params });
    return response.data;
  },

  getPersonnelById: async (personId) => {
    const response = await api.get(`/personnel/${personId}`);
    return response.data;
  }
};
