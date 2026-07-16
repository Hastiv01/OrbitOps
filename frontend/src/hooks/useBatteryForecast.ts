import { useState, useEffect } from 'react';
import { forecastBattery, TelemetryInput } from '../services/resourceIntelligenceApi';

export interface BatteryForecastPoint {
  hour: number;
  batteryPercent: number;
}

export const useBatteryForecast = (telemetry: TelemetryInput, hours: number = 12) => {
  const [data, setData] = useState<BatteryForecastPoint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const telemetryStr = JSON.stringify(telemetry);

  useEffect(() => {
    let active = true;
    const fetchForecast = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await forecastBattery(telemetry, hours);
        if (active) {
          setData(result.forecast || []);
        }
      } catch (err: any) {
        if (active) {
          setError(err.message || 'Failed to fetch battery forecast');
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    fetchForecast();

    return () => {
      active = false;
    };
  }, [telemetryStr, hours]);

  return { data, isLoading, error };
};
