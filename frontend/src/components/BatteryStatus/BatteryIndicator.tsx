interface BatteryIndicatorProps {
  percentage: number;
}

const BatteryIndicator = ({ percentage }: BatteryIndicatorProps) => {
  const tone = percentage > 75 ? 'from-emerald-400 to-emerald-500' : percentage > 50 ? 'from-amber-400 to-orange-500' : 'from-rose-400 to-rose-500';

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-4 shadow-glow">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold text-white">Battery Reserve</p>
        <span className="text-sm font-semibold text-slate-300">{percentage}%</span>
      </div>
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-800">
        <div className={`h-full rounded-full bg-gradient-to-r ${tone}`} style={{ width: `${percentage}%` }} />
      </div>
      <p className="mt-3 text-sm text-slate-400">Nominal output maintained under current planning load.</p>
    </div>
  );
};

export default BatteryIndicator;
