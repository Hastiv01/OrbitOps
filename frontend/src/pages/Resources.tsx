import { FiBatteryCharging, FiHardDrive, FiServer, FiZap } from 'react-icons/fi';
import ResourceChart from '../components/ResourceCharts/ResourceChart';
import BatteryIndicator from '../components/BatteryStatus/BatteryIndicator';
import { resourceData } from '../data/dummyData';

const Resources = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Battery', value: '78%', icon: FiBatteryCharging },
          { label: 'Power', value: '62%', icon: FiZap },
          { label: 'Memory', value: '69%', icon: FiServer },
          { label: 'Storage', value: '74%', icon: FiHardDrive },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-glow backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-400">{item.label}</p>
                <div className="rounded-xl bg-sky-500/15 p-2 text-sky-300"><Icon /></div>
              </div>
              <p className="mt-4 text-3xl font-semibold text-white">{item.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <BatteryIndicator percentage={78} />
        <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-glow backdrop-blur-xl">
          <p className="mb-4 text-lg font-semibold text-white">Prediction Snapshot</p>
          <div className="space-y-3 text-sm text-slate-300">
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
              <p className="font-medium text-white">Projected battery reserve</p>
              <p className="mt-2">Expected to drop by 6% over the next 4 hours under current load.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
              <p className="font-medium text-white">Storage pressure</p>
              <p className="mt-2">A 5% gain in image acquisition volume is expected before midnight.</p>
            </div>
          </div>
        </div>
      </div>

      <ResourceChart data={resourceData} />
    </div>
  );
};

export default Resources;
