import { CartesianGrid, Line, Area, ComposedChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend, Brush } from 'recharts';

interface ResourceChartProps {
  data: any[];
  title?: string;
  unit?: string;
  color?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 border border-slate-700/50 p-3 rounded-lg shadow-xl backdrop-blur-md">
          <p className="text-slate-300 text-xs mb-2">{label}</p>
          <div className="space-y-1">
            {data.actual !== undefined && data.actual > 0 && (
              <p className="text-white text-sm"><span className="text-slate-400">Actual:</span> {data.actual.toFixed(1)}</p>
            )}
            {data.predicted !== undefined && (
                <p className="text-sky-400 text-sm"><span className="text-slate-400">Predicted:</span> {data.predicted.toFixed(1)}</p>
            )}
            {data.upperBound !== undefined && data.lowerBound !== undefined && (
                <>
                    <p className="text-emerald-400 text-xs"><span className="text-slate-400">Upper:</span> {data.upperBound.toFixed(1)}</p>
                    <p className="text-rose-400 text-xs"><span className="text-slate-400">Lower:</span> {data.lowerBound.toFixed(1)}</p>
                    <p className="text-slate-300 text-xs"><span className="text-slate-400">Diff:</span> {(data.upperBound - data.lowerBound).toFixed(1)}</p>
                    <p className="text-violet-300 text-xs"><span className="text-slate-400">Confidence:</span> 95%</p>
                </>
            )}
            {data.battery !== undefined && (
                <>
                    <p className="text-white text-sm"><span className="text-slate-400">Battery:</span> {data.battery}%</p>
                    <p className="text-white text-sm"><span className="text-slate-400">Power:</span> {data.power}W</p>
                </>
            )}
          </div>
        </div>
      );
    }
    return null;
};

const ResourceChart = ({ data, title = "Resource Trend", unit = "", color = "#38bdf8" }: ResourceChartProps) => {
  const isForecast = data.length > 0 && data[0].predicted !== undefined;

  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-950/70 p-4 shadow-sm dark:shadow-glow print:shadow-none">
      <p className="mb-4 text-lg font-semibold text-slate-900 dark:text-white print:text-black">{title}</p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="rgba(148, 163, 184, 0.16)" strokeDasharray="4 4" />
            <XAxis dataKey={isForecast ? "time" : "name"} stroke="#94a3b8" tick={{ fontSize: 10 }} interval={isForecast ? 5 : 0} />
            <YAxis stroke="#94a3b8" tick={{ fontSize: 10 }} label={{ value: unit, angle: -90, position: 'insideLeft', style: { fill: '#64748b', fontSize: 10 } }} />
            <Tooltip content={<CustomTooltip />} />
            {isForecast && <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />}
            
            {isForecast ? (
                <>
                    {/* Confidence interval band */}
                    <Area 
                      type="monotone" 
                      dataKey={(d) => [d.lowerBound, d.upperBound]} 
                      stroke="none" 
                      fill={color} 
                      fillOpacity={0.15} 
                      name="95% Confidence Interval"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="actual" 
                      stroke={color} 
                      strokeWidth={2} 
                      dot={false} 
                      name="Actual"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="predicted" 
                      stroke={color} 
                      strokeWidth={2} 
                      strokeDasharray="4 4" 
                      dot={false} 
                      name="Predicted"
                    />
                    <Brush dataKey="time" height={20} stroke="#64748b" fill="rgba(15, 23, 42, 0.5)" tickFormatter={() => ''} />
                </>
            ) : (
                <>
                    <Line type="monotone" dataKey="battery" stroke="#38bdf8" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="power" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ResourceChart;
