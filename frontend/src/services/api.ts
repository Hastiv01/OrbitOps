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

export const optimizeGroundStations = async (request: any) => {
  return api.post('/optimization/ground-stations', request);
};

export const assignGroundStation = async (request: any) => {
  return api.post('/infrastructure/ground-stations/assign', request);
};

export const assignPayload = async (payloadId: string, request: any) => {
  return api.post(`/infrastructure/payloads/${payloadId}/assign`, request);
};

export const schedulePayload = async (payloadId: string, request: any) => {
  return api.post(`/infrastructure/payloads/${payloadId}/schedule`, request);
};

export const requestMaintenance = async (request: any) => {
  return api.post('/maintenance/request', request);
};

export const updateSatelliteStatus = async (satelliteId: string, status: string) => {
  return api.post(`/infrastructure/satellites/${satelliteId}/status?status=${status}`);
};

export const updatePayloadStatus = async (payloadId: string, status: string) => {
  return api.post(`/infrastructure/payloads/${payloadId}/status?status=${status}`);
};

export const fetchTelemetry = async (satelliteId: string) => {
  return api.get(`/telemetry/${satelliteId}`);
};

export default api;
