import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useBatteryForecast } from '../../hooks/useBatteryForecast';
import { TelemetryInput } from '../../services/resourceIntelligenceApi';

interface BatteryForecastChartProps {
  satelliteName: string;
  telemetry: TelemetryInput;
  hours?: number;
}

/**
 * Drop-in replacement / addition for the static "Prediction Snapshot" card
 * on the Resources page. Renders the actual model-predicted battery
 * trajectory instead of a hardcoded blurb.
 *
 * Usage:
 *   <BatteryForecastChart
 *     satelliteName={sat.name}
 *     telemetry={{
 *       current_battery_percent: sat.batteryHealth,
 *       orbit_type: sat.orbit,
 *       temperature_celsius: sat.temperature,
 *     }}
 *   />
 */
const BatteryForecastChart = ({ satelliteName, telemetry, hours = 12 }: BatteryForecastChartProps) => {
  const { data, isLoading, error } = useBatteryForecast(telemetry, hours);

  const endValue = data[data.length - 1]?.batteryPercent ?? telemetry.current_battery_percent;
  const startValue = data[0]?.batteryPercent ?? telemetry.current_battery_percent;
  const trend = endValue - startValue;

  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-800 print:bg-white p-5 shadow-sm dark:shadow-glow print:shadow-none backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-lg font-semibold text-slate-900 dark:text-white print:text-black">
            Battery Forecast — {satelliteName}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 print:text-slate-700">
            Next {hours}h, predicted by the trained battery model
          </p>
        </div>
        {!isLoading && (
          <span className={`text-sm font-semibold ${trend < 0 ? 'text-red-400' : trend > 0 ? 'text-emerald-400' : 'text-slate-500'}`}>
            {trend > 0 ? '+' : ''}{trend.toFixed(1)}%
          </span>
        )}
      </div>

      {error && <p className="mb-2 text-xs text-amber-500">{error}</p>}

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="rgba(148,163,184,0.16)" strokeDasharray="4 4" />
            <XAxis dataKey="hour" tickFormatter={(h) => `${h}h`} stroke="currentColor" className="text-slate-600 dark:text-slate-400 print:text-black" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 100]} stroke="currentColor" className="text-slate-600 dark:text-slate-400 print:text-black" tick={{ fontSize: 11 }} />
            <Tooltip
              formatter={(val: number) => [`${val}%`, 'Battery']}
              labelFormatter={(h) => `+${h}h`}
              contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff' }}
            />
            <Area
              type="monotone"
              dataKey="batteryPercent"
              stroke={endValue < 20 ? '#ef4444' : endValue < 40 ? '#f59e0b' : '#10b981'}
              fill={endValue < 20 ? '#ef4444' : endValue < 40 ? '#f59e0b' : '#10b981'}
              fillOpacity={0.2}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BatteryForecastChart;
