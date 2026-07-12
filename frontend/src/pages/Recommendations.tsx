import { FiAlertTriangle, FiCpu, FiRadio, FiZap } from 'react-icons/fi';
import RecommendationCard from '../components/RecommendationPanel/RecommendationCard';
import { recommendations } from '../data/dummyData';

const Recommendations = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Priority', value: '12', icon: FiZap },
          { label: 'Optimizations', value: '7', icon: FiCpu },
          { label: 'Warnings', value: '3', icon: FiAlertTriangle },
          { label: 'Communications', value: '4', icon: FiRadio },
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

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          {recommendations.map((item) => (
            <RecommendationCard key={item.id} recommendation={item} />
          ))}
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-glow backdrop-blur-xl">
          <p className="text-lg font-semibold text-white">Recommendation Context</p>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
              <p className="font-medium text-white">Risk Level</p>
              <p className="mt-2">Moderate. Priority actions should be executed within the next 90 minutes.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
              <p className="font-medium text-white">Resource warnings</p>
              <p className="mt-2">Battery reserve is trending down, and uplink capacity is nearing saturation.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
