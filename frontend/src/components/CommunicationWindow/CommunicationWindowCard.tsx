import type { CommunicationWindow } from '../../types';

interface CommunicationWindowCardProps {
  window: CommunicationWindow;
}

const CommunicationWindowCard = ({ window }: CommunicationWindowCardProps) => {
  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-slate-50 dark:bg-slate-800/80 print:bg-white p-4 shadow-sm dark:shadow-glow print:shadow-none">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-slate-900 dark:text-white print:text-black">{window.station}</p>
        <span className="rounded-full bg-sky-500/15 px-3 py-1 text-xs font-semibold text-sky-600 dark:text-sky-300 print:text-black">
          {window.status}
        </span>
      </div>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 print:text-slate-700">{window.satellite}</p>
      <div className="mt-4 flex items-center justify-between text-sm text-slate-600 dark:text-slate-300 print:text-slate-800">
        <span>{window.startTime} - {window.endTime}</span>
        <span className="font-semibold text-slate-900 dark:text-white print:text-black">{window.window}</span>
      </div>
    </div>
  );
};

export default CommunicationWindowCard;
