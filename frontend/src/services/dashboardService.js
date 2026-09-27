import api from './api';

export const dashboardService = {
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  getExpeditions: async () => {
    const response = await api.get('/dashboard/expeditions');
    return response.data;
  },

  getAlerts: async () => {
    const response = await api.get('/dashboard/alerts');
    return response.data;
  },

  getSummary: async () => {
    const response = await api.get('/dashboard/summary');
    return response.data;
  }
};
