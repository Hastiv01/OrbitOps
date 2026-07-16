import { CartesianGrid, Line, Area, ComposedChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend, Brush } from 'recharts';

interface ResourceChartProps {
  data: any[];
  title?: string;
  unit?: string;
  color?: string;
  hideHeader?: boolean;
  transparent?: boolean;
}

const CustomTooltip = ({ active, payload, label, unit }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 border border-slate-700/50 p-3 rounded-lg shadow-xl backdrop-blur-md">
          <p className="text-slate-300 text-xs mb-2">{label}</p>
          <div className="space-y-1">
            {data.actual !== undefined && data.actual !== 0 && (
              <p className="text-white text-sm"><span className="text-slate-400">Actual:</span> {data.actual.toFixed(1)} {unit}</p>
            )}
            {data.predicted !== undefined && (
                <p className="text-sky-400 text-sm"><span className="text-slate-400">Predicted:</span> {data.predicted.toFixed(1)} {unit}</p>
            )}
            {data.upperBound !== undefined && data.lowerBound !== undefined && (
                <>
                    <p className="text-emerald-400 text-xs"><span className="text-slate-400">Upper:</span> {data.upperBound.toFixed(1)} {unit}</p>
                    <p className="text-rose-400 text-xs"><span className="text-slate-400">Lower:</span> {data.lowerBound.toFixed(1)} {unit}</p>
                    <p className="text-slate-300 text-xs"><span className="text-slate-400">Diff:</span> {(data.upperBound - data.lowerBound).toFixed(1)} {unit}</p>
                    <p className="text-violet-300 text-xs"><span className="text-slate-400">Confidence:</span> 95%</p>
                </>
            )}
            {data.cpu !== undefined && data.memory !== undefined && (
                <>
                    <p className="text-amber-400 text-sm"><span className="text-slate-400">CPU:</span> {data.cpu.toFixed(1)}%</p>
                    <p className="text-sky-400 text-sm"><span className="text-slate-400">Memory:</span> {data.memory.toFixed(1)}%</p>
                    <p className="text-rose-400 text-sm"><span className="text-slate-400">Storage:</span> {data.storage.toFixed(1)}%</p>
                    <p className="text-violet-400 text-sm"><span className="text-slate-400">Power:</span> {data.power.toFixed(1)}W</p>
                    <p className="text-emerald-400 text-sm"><span className="text-slate-400">Bandwidth:</span> {data.bandwidth.toFixed(1)} Mbps</p>
                </>
            )}
            {data.battery !== undefined && data.cpu === undefined && (
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

const ResourceChart = ({ data, title = "Resource Trend", unit = "", color = "#38bdf8", hideHeader = false, transparent = false }: ResourceChartProps) => {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-950/70 p-4 shadow-sm dark:shadow-glow print:shadow-none flex flex-col">
        <p className="mb-4 text-lg font-semibold text-slate-900 dark:text-white print:text-black">{title}</p>
        <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/30">
          <svg className="w-10 h-10 mb-3 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No Data Available</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Forecast models offline.</p>
        </div>
      </div>
    );
  }

  const isForecast = data[0].predicted !== undefined;
  const baseName = title.replace(' Forecast', '');
  
  const chartData = data;

  const formatXAxis = (tickItem: any) => {
    if (typeof tickItem === 'string' && tickItem.includes(':00')) {
      const parts = tickItem.split(' ');
      const time = parts[0];
      if (parts[1] === '+1d') {
        if (time === '00:00') return 'Day 2';
        return time;
      }
      return time;
    }
    return tickItem;
  };

  return (
    <div className={transparent ? "w-full h-full p-2" : "rounded-3xl border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-950/70 p-4 shadow-sm dark:shadow-glow print:shadow-none"}>
      {!hideHeader && <p className="mb-4 text-lg font-semibold text-slate-900 dark:text-white print:text-black">{title}</p>}
      <div className={transparent ? "h-[220px] min-h-[220px]" : "h-64 min-h-[250px]"}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={transparent ? { top: 10, right: 10, left: -25, bottom: 0 } : { top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="rgba(148, 163, 184, 0.16)" strokeDasharray="4 4" />
            <XAxis dataKey={isForecast ? "time" : "name"} stroke="#94a3b8" tick={{ fontSize: 10 }} tickFormatter={formatXAxis} interval={isForecast ? 5 : 0} />
            <YAxis stroke="#94a3b8" tick={{ fontSize: 10 }} domain={['auto', 'auto']} label={{ value: unit, angle: -90, position: 'insideLeft', style: { fill: '#64748b', fontSize: 10 } }} />
            <Tooltip content={(props: any) => <CustomTooltip {...props} unit={unit} />} />
            <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
            
            {isForecast ? (
                <>
                    <Line 
                      type="monotone" 
                      dataKey="actual" 
                      stroke={color} 
                      strokeWidth={2} 
                      dot={false} 
                      name={`Actual ${baseName}`}
                      isAnimationActive={false}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="predicted" 
                      stroke={color} 
                      strokeWidth={2} 
                      strokeDasharray="4 4" 
                      dot={false} 
                      name={`Predicted ${baseName}`}
                      isAnimationActive={false}
                    />
                    <Brush dataKey="time" height={20} stroke="#64748b" fill="rgba(15, 23, 42, 0.5)" tickFormatter={() => ''} />
                </>
            ) : (
                <>
                    <Line type="monotone" dataKey="cpu" stroke="#f59e0b" strokeWidth={2} dot={false} name="CPU (%)" isAnimationActive={false} />
                    <Line type="monotone" dataKey="memory" stroke="#38bdf8" strokeWidth={2} dot={false} name="Memory (%)" isAnimationActive={false} />
                    <Line type="monotone" dataKey="storage" stroke="#ef4444" strokeWidth={2} dot={false} name="Storage (%)" isAnimationActive={false} />
                    <Line type="monotone" dataKey="power" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Power (W)" isAnimationActive={false} />
                    <Line type="monotone" dataKey="bandwidth" stroke="#10b981" strokeWidth={2} dot={false} name="Bandwidth (Mbps)" isAnimationActive={false} />
                </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ResourceChart;
