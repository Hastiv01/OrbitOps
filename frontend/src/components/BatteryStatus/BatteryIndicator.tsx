interface BatteryIndicatorProps {
  percentage: number;
}

const BatteryIndicator = ({ percentage }: BatteryIndicatorProps) => {
  const tone = percentage > 75 ? 'from-emerald-400 to-emerald-500' : percentage > 50 ? 'from-amber-400 to-orange-500' : 'from-rose-400 to-rose-500';

  return (
    <div className="rounded-3xl border border-slate-200 dark:border-white/10 print:border-slate-300 bg-slate-950/70 p-4 shadow-sm dark:shadow-glow print:shadow-none">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold text-slate-900 dark:text-white print:text-black">Battery Reserve</p>
        <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 print:text-slate-800">{percentage}%</span>
      </div>
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-800">
        <div className={`h-full rounded-full bg-gradient-to-r ${tone}`} style={{ width: `${percentage}%` }} />
      </div>
      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 print:text-slate-700">Nominal output maintained under current planning load.</p>
    </div>
  );
};

export default BatteryIndicator;
