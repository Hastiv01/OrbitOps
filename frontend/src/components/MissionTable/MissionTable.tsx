import type { Mission } from '../../types';

interface MissionTableProps {
  missions: Mission[];
}

const MissionTable = ({ missions }: MissionTableProps) => {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70 shadow-glow">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <div>
          <p className="text-lg font-semibold text-white">Mission Queue</p>
          <p className="text-sm text-slate-400">Upcoming activities and priorities</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/5 text-slate-300">
            <tr>
              <th className="px-5 py-3 font-medium">Mission</th>
              <th className="px-5 py-3 font-medium">Priority</th>
              <th className="px-5 py-3 font-medium">Time</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {missions.map((mission) => (
              <tr key={mission.id} className="border-t border-white/10 text-slate-300">
                <td className="px-5 py-4">
                  <p className="font-medium text-white">{mission.name}</p>
                  <p className="text-xs text-slate-500">{mission.satellite}</p>
                </td>
                <td className="px-5 py-4">
                  <span className="rounded-full bg-sky-500/15 px-3 py-1 text-xs font-semibold text-sky-300">
                    {mission.priority}
                  </span>
                </td>
                <td className="px-5 py-4">{mission.startTime} - {mission.endTime}</td>
                <td className="px-5 py-4">
                  <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300">
                    {mission.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MissionTable;
