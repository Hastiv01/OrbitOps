import api from './api';

export interface TelemetryInput {
  orbit_type?: string;
  orbit_altitude_km?: number;
  inclination_deg?: number;
  current_battery_percent: number;
  previous_battery_percent?: number;
  solar_exposure_hours?: number;
  eclipse_duration_hours?: number;
  payload_count?: number;
  payload_power_kw?: number;
  communication_duration_minutes?: number;
  communication_bandwidth_mbps?: number;
  onboard_memory_used_gb?: number;
  onboard_memory_total_gb?: number;
  cpu_utilization_percent?: number;
  temperature_celsius?: number;
  mission_duration_hours?: number;
  previous_power_consumption_kw?: number;
  power_consumption_kw?: number;
}

export const getFleetUtilization = async () => {
  const response = await api.get('/resources/utilization');
  return response.data;
};

export const predictBattery = async (telemetry: TelemetryInput) => {
  const response = await api.post('/resources/predict-battery', telemetry);
  return response.data;
};

export const forecastBattery = async (telemetry: TelemetryInput, hours: number = 12) => {
  const response = await api.post(`/resources/forecast-battery?hours=${hours}`, telemetry);
  return response.data;
};

export const predictRisk = async (telemetry: TelemetryInput) => {
  const response = await api.post('/resources/predict-risk', telemetry);
  return response.data;
};

export const getModelStatus = async () => {
  const response = await api.get('/resources/model-status');
  return response.data;
};
