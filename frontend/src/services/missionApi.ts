import axios from 'axios';

const missionApi = axios.create({
  baseURL: '/api/missions',
  timeout: 8000,
});

export const getMissionOverview = async () => {
  return missionApi.get('/');
};

export default missionApi;
