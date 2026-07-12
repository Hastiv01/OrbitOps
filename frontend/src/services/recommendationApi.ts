import axios from 'axios';

const recommendationApi = axios.create({
  baseURL: '/api/recommendations',
  timeout: 8000,
});

export const getRecommendations = async () => {
  return recommendationApi.get('/');
};

export default recommendationApi;
