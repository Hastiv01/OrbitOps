import type { CommunicationWindow } from '../../types';

interface CommunicationWindowCardProps {
  window: CommunicationWindow;
}

const CommunicationWindowCard = ({ window }: CommunicationWindowCardProps) => {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4 shadow-glow">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-white">{window.station}</p>
        <span className="rounded-full bg-sky-500/15 px-3 py-1 text-xs font-semibold text-sky-300">
          {window.status}
        </span>
      </div>
      <p className="mt-3 text-sm text-slate-400">{window.satellite}</p>
      <div className="mt-4 flex items-center justify-between text-sm text-slate-300">
        <span>{window.startTime} - {window.endTime}</span>
        <span className="font-semibold text-white">{window.window}</span>
      </div>
    </div>
  );
};

export default CommunicationWindowCard;
