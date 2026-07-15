import type { Payload } from '../../types';

interface PayloadCardProps {
  payload: Payload;
}

const PayloadCard = ({ payload }: PayloadCardProps) => {
  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-800 print:bg-white p-4 shadow-sm dark:shadow-glow print:shadow-none backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-slate-900 dark:text-white print:text-black">{payload.name}</p>
          <p className="text-sm text-slate-600 dark:text-slate-400 print:text-slate-700">{payload.type}</p>
        </div>
        <span className="rounded-full bg-violet-500/15 px-3 py-1 text-xs font-semibold text-violet-300">
          {payload.status}
        </span>
      </div>
      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between text-sm text-slate-600 dark:text-slate-300 print:text-slate-800">
          <span>Utilization</span>
          <span>{payload.utilization}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-800">
          <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-sky-400" style={{ width: `${payload.utilization}%` }} />
        </div>
      </div>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 print:text-slate-700">Power draw: {payload.power}</p>
    </div>
  );
};

export default PayloadCard;
