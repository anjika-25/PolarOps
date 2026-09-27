import api from './api';

export const emergencyService = {
  getIncidents: async (filters = {}) => {
    const params = {};
    if (filters.status) params.status = filters.status;
    if (filters.severity) params.severity = filters.severity;
    if (filters.type) params.type = filters.type;

    const response = await api.get('/emergency', { params });
    return response.data;
  },

  declareEmergency: async (data) => {
    const payload = {
      type: data.type,
      location: data.location,
      severity: data.severity,
      affected_personnel: data.affected_personnel ? data.affected_personnel.trim() : null
    };

    const response = await api.post('/emergency', payload);
    return response.data;
  }
};
