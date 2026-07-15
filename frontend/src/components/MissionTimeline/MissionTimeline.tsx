import { motion } from 'framer-motion';
import type { Mission } from '../../types';

interface MissionTimelineProps {
  missions: Mission[];
}

const MissionTimeline = ({ missions }: MissionTimelineProps) => {
  return (
    <div className="rounded-3xl border border-slate-200 dark:border-white/10 print:border-slate-300 bg-white dark:bg-white/10 print:bg-white p-5 shadow-sm dark:shadow-glow print:shadow-none backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-lg font-semibold text-slate-900 dark:text-white print:text-black">Timeline Overview</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 print:text-slate-700">Live scheduling pulse for the day</p>
        </div>
      </div>
      <div className="space-y-4">
        {missions.map((mission, index) => (
          <div key={mission.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="mt-1 h-3 w-3 rounded-full bg-sky-400" />
              {index < missions.length - 1 ? <div className="mt-1 h-full w-px bg-white dark:bg-white/10 print:bg-white" /> : null}
            </div>
            <motion.div layout className="flex-1 rounded-2xl border border-slate-200 dark:border-white/10 print:border-slate-300 bg-slate-50 dark:bg-slate-950/50 print:bg-white p-3">
              <div className="flex items-center justify-between">
                <p className="font-medium text-slate-900 dark:text-white print:text-black">{mission.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 print:text-slate-700">{mission.startTime} → {mission.endTime}</p>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                <div className="h-full rounded-full bg-gradient-to-r from-sky-400 to-violet-500" style={{ width: `${mission.progress}%` }} />
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MissionTimeline;
