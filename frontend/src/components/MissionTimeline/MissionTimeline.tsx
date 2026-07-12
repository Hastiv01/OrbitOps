import { motion } from 'framer-motion';
import type { Mission } from '../../types';

interface MissionTimelineProps {
  missions: Mission[];
}

const MissionTimeline = ({ missions }: MissionTimelineProps) => {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-glow backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-lg font-semibold text-white">Timeline Overview</p>
          <p className="text-sm text-slate-400">Live scheduling pulse for the day</p>
        </div>
      </div>
      <div className="space-y-4">
        {missions.map((mission, index) => (
          <div key={mission.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="mt-1 h-3 w-3 rounded-full bg-sky-400" />
              {index < missions.length - 1 ? <div className="mt-1 h-full w-px bg-white/10" /> : null}
            </div>
            <motion.div layout className="flex-1 rounded-2xl border border-white/10 bg-slate-950/50 p-3">
              <div className="flex items-center justify-between">
                <p className="font-medium text-white">{mission.name}</p>
                <p className="text-sm text-slate-400">{mission.startTime} → {mission.endTime}</p>
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
