import type { Payload } from '../../types';

interface PayloadCardProps {
  payload: Payload;
}

const PayloadCard = ({ payload }: PayloadCardProps) => {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-4 shadow-glow backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-white">{payload.name}</p>
          <p className="text-sm text-slate-400">{payload.type}</p>
        </div>
        <span className="rounded-full bg-violet-500/15 px-3 py-1 text-xs font-semibold text-violet-300">
          {payload.status}
        </span>
      </div>
      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
          <span>Utilization</span>
          <span>{payload.utilization}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-800">
          <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-sky-400" style={{ width: `${payload.utilization}%` }} />
        </div>
      </div>
      <p className="mt-3 text-sm text-slate-400">Power draw: {payload.power}</p>
    </div>
  );
};

export default PayloadCard;
