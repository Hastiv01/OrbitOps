import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 8000,
});

export const fetchMissions = async () => {
  return api.get('/missions');
};

export const createMission = async (mission: any) => {
  return api.post('/missions', mission);
};

export const updateMission = async (id: string, updates: any) => {
  return api.put(`/missions/${id}`, updates);
};

export const deleteMission = async (id: string) => {
  return api.delete(`/missions/${id}`);
};

export const fetchSatellites = async () => {
  return api.get('/infrastructure/satellites');
};

export const fetchPayloads = async () => {
  return api.get('/infrastructure/payloads');
};

export const fetchGroundStations = async () => {
  return api.get('/infrastructure/ground-stations');
};

export const fetchRecommendations = async () => {
  return api.get('/recommendations');
};

export default api;
