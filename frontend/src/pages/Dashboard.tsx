 import { FiActivity, FiCpu, FiMapPin, FiZap } from 'react-icons/fi';
import { Pie, PieChart, Cell, ResponsiveContainer, Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';
import DashboardCard from '../components/DashboardCards/DashboardCard';
import MissionTimeline from '../components/MissionTimeline/MissionTimeline';
import MissionTable from '../components/MissionTable/MissionTable';
import BatteryIndicator from '../components/BatteryStatus/BatteryIndicator';
import RecommendationCard from '../components/RecommendationPanel/RecommendationCard';
import Footer from '../components/Footer/Footer';
import { communicationWindows, groundStations, missions, recommendations, resourceData, satellites } from '../data/dummyData';

const pieData = [
  { name: 'Operational', value: 74 },
  { name: 'Maintenance', value: 16 },
  { name: 'Standby', value: 10 },
];

const pieColors = ['#38bdf8', '#8b5cf6', '#f59e0b'];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardCard title="Total Missions" value="24" subtitle="Across 3 orbital constellations" icon={<FiActivity />} />
        <DashboardCard title="Active Missions" value="8" subtitle="2 require immediate attention" icon={<FiZap />} accent="from-amber-400 to-orange-500" />
        <DashboardCard title="Scheduled Tasks" value="41" subtitle="11 high-priority windows" icon={<FiCpu />} accent="from-emerald-400 to-cyan-500" />
        <DashboardCard title="Satellite Health" value="91%" subtitle="Average asset readiness" icon={<FiMapPin />} accent="from-violet-500 to-fuchsia-500" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <MissionTimeline missions={missions} />
        <BatteryIndicator percentage={78} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <MissionTable missions={missions} />
        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-glow backdrop-blur-xl">
            <p className="mb-4 text-lg font-semibold text-white">Mission Status</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" innerRadius={60} outerRadius={90} paddingAngle={3}>
                    {pieData.map((entry, index) => (
                      <Cell key={entry.name} fill={pieColors[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-glow backdrop-blur-xl">
            <p className="mb-4 text-lg font-semibold text-white">Today’s Communication Windows</p>
            <div className="space-y-3">
              {communicationWindows.slice(0, 2).map((window) => (
                <div key={window.id} className="rounded-2xl border border-white/10 bg-slate-950/50 p-3 text-sm text-slate-300">
                  <p className="font-medium text-white">{window.station}</p>
                  <p className="mt-1">{window.startTime} - {window.endTime}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-glow backdrop-blur-xl">
          <p className="mb-4 text-lg font-semibold text-white">Resource Utilization</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={resourceData}>
                <CartesianGrid stroke="rgba(148, 163, 184, 0.16)" strokeDasharray="4 4" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Area type="monotone" dataKey="storage" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.2} />
                <Area type="monotone" dataKey="memory" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.18} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-glow backdrop-blur-xl">
            <p className="mb-4 text-lg font-semibold text-white">Ground Stations</p>
            <div className="space-y-3">
              {groundStations.map((station) => (
                <div key={station.id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-white">{station.name}</p>
                    <span className="text-xs text-emerald-300">{station.availability}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-400">{station.location} • {station.latency}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-glow backdrop-blur-xl">
            <p className="mb-4 text-lg font-semibold text-white">Recent Recommendations</p>
            <div className="space-y-3">
              {recommendations.slice(0, 2).map((item) => (
                <RecommendationCard key={item.id} recommendation={item} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Dashboard;
