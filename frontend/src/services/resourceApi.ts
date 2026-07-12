import axios from 'axios';

const resourceApi = axios.create({
  baseURL: '/api/resources',
  timeout: 8000,
});

export const getResourceMetrics = async () => {
  return resourceApi.get('/');
};

export default resourceApi;
