import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.access_token) {
      localStorage.setItem('polarops_token', response.data.access_token);
      localStorage.setItem('polarops_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('polarops_token');
    localStorage.removeItem('polarops_user');
  },

  getStoredUser: () => {
    const userStr = localStorage.getItem('polarops_user');
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
      return null;
    }
  },

  getStoredToken: () => {
    return localStorage.getItem('polarops_token');
  }
};
