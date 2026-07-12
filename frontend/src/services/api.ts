import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 8000,
});

export const fetchMissions = async () => {
  return api.get('/missions');
};

export const fetchResources = async () => {
  return api.get('/resources');
};

export const fetchRecommendations = async () => {
  return api.get('/recommendations');
};

export default api;
