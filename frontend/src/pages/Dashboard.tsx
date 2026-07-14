import { useState } from 'react';
import { FiActivity, FiCpu, FiMapPin, FiZap, FiPlus, FiFileText, FiCalendar, FiRefreshCw, FiSearch, FiClock, FiCloud, FiAlertTriangle, FiCheck, FiWifi, FiRadio } from 'react-icons/fi';
import { Pie, PieChart, Cell, ResponsiveContainer, Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';
import DashboardCard from '../components/DashboardCards/DashboardCard';
import MissionTimeline from '../components/MissionTimeline/MissionTimeline';
import MissionTable from '../components/MissionTable/MissionTable';
import BatteryIndicator from '../components/BatteryStatus/BatteryIndicator';
import RecommendationCard from '../components/RecommendationPanel/RecommendationCard';
import Footer from '../components/Footer/Footer';
import { Badge, Button, ProgressBar, Card } from '../components/common/index';
import { communicationWindows, groundStations, missions, recommendations, resourceData, satellites } from '../data/dummyData';
import { missionAlerts, todaysMissionSchedule, recentActivities, systemStatus, weatherImpacts, satelliteHealthSummaries } from '../data/extendedMockData';

const pieData = [
  { name: 'Operational', value: 74 },
  { name: 'Maintenance', value: 16 },
  { name: 'Standby', value: 10 },
];

const pieColors = ['#38bdf8', '#8b5cf6', '#f59e0b'];

const alertSeverityColors: Record<string, string> = {
  Critical: 'border-l-red-500 bg-red-500/5',
  High: 'border-l-amber-500 bg-amber-500/5',
  Medium: 'border-l-sky-500 bg-sky-500/5',
  Low: 'border-l-slate-500 bg-slate-500/5',
};

const alertTypeIcons: Record<string, JSX.Element> = {
  'Battery Low': <FiZap className="text-red-400" />,
  'Communication Conflict': <FiRadio className="text-amber-400" />,
  'Payload Delay': <FiClock className="text-sky-400" />,
  'Orbit Warning': <FiAlertTriangle className="text-amber-400" />,
};

const activityColors: Record<string, string> = {
  mission: 'bg-sky-500',
  alert: 'bg-red-500',
  system: 'bg-slate-500',
  communication: 'bg-emerald-500',
  recommendation: 'bg-violet-500',
  optimization: 'bg-amber-500',
};

const Dashboard = () => {
  const [scheduleSearch, setScheduleSearch] = useState('');
  const [lastUpdated] = useState(new Date().toLocaleTimeString());

  const filteredSchedule = todaysMissionSchedule.filter(m =>
    m.mission.toLowerCase().includes(scheduleSearch.toLowerCase()) ||
    m.satellite.toLowerCase().includes(scheduleSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500">Dashboard</p>
          <h1 className="text-3xl font-bold text-white">Mission Control</h1>
          <p className="mt-1 text-slate-400">Real-time overview of satellite operations</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500">Updated {lastUpdated}</span>
          <Button variant="secondary" size="sm" icon={<FiRefreshCw />} onClick={() => window.location.reload()}>Refresh</Button>
        </div>
      </div>

      {/* Existing Stat Cards */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardCard title="Total Missions" value="24" subtitle="Across 3 orbital constellations" icon={<FiActivity />} />
        <DashboardCard title="Active Missions" value="8" subtitle="2 require immediate attention" icon={<FiZap />} accent="from-amber-400 to-orange-500" />
        <DashboardCard title="Scheduled Tasks" value="41" subtitle="11 high-priority windows" icon={<FiCpu />} accent="from-emerald-400 to-cyan-500" />
        <DashboardCard title="Satellite Health" value="91%" subtitle="Average asset readiness" icon={<FiMapPin />} accent="from-violet-500 to-fuchsia-500" />
      </section>

      {/* Quick Actions */}
      <section className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-glow backdrop-blur-xl">
        <p className="mb-4 text-lg font-semibold text-white">Quick Actions</p>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary" size="md" icon={<FiZap />}>Run Optimization</Button>
          <Button variant="secondary" size="md" icon={<FiPlus />}>Create Mission</Button>
          <Button variant="secondary" size="md" icon={<FiFileText />}>Generate Report</Button>
          <Button variant="secondary" size="md" icon={<FiCalendar />}>Open Scheduler</Button>
        </div>
      </section>

      {/* Mission Alerts */}
      <section className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-glow backdrop-blur-xl">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-lg font-semibold text-white">Mission Alerts</p>
          <Badge variant="danger">{missionAlerts.filter(a => !a.acknowledged).length} Active</Badge>
        </div>
        <div className="space-y-3">
          {missionAlerts.slice(0, 5).map(alert => (
            <div key={alert.id} className={`rounded-2xl border border-white/10 border-l-4 p-4 ${alertSeverityColors[alert.severity]}`}>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 text-lg">{alertTypeIcons[alert.type]}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-white">{alert.title}</p>
                    <Badge variant={alert.severity === 'Critical' ? 'danger' : alert.severity === 'High' ? 'warning' : 'info'}>{alert.severity}</Badge>
                    {alert.acknowledged && <Badge variant="success"><FiCheck className="mr-1 inline" />ACK</Badge>}
                  </div>
                  <p className="mt-1 text-sm text-slate-400">{alert.message}</p>
                  <p className="mt-2 text-xs text-slate-500">{new Date(alert.timestamp).toLocaleString()} • {alert.satellite}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Existing Mission Timeline + Battery */}
      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <MissionTimeline missions={missions} />
        <BatteryIndicator percentage={78} />
      </section>

      {/* Today's Mission Schedule */}
      <section className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-glow backdrop-blur-xl">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-lg font-semibold text-white">Today's Mission Schedule</p>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search schedule..." value={scheduleSearch} onChange={e => setScheduleSearch(e.target.value)} className="rounded-lg border border-white/10 bg-white/5 py-1.5 pl-9 pr-4 text-sm text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-white/10 bg-white/5">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">Mission</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">Satellite</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">Start</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">End</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">Priority</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredSchedule.map(m => (
                <tr key={m.id} className="transition hover:bg-white/5">
                  <td className="px-4 py-3 text-sm font-medium text-white">{m.mission}</td>
                  <td className="px-4 py-3 text-sm text-slate-300">{m.satellite}</td>
                  <td className="px-4 py-3 text-sm text-slate-300">{m.start}</td>
                  <td className="px-4 py-3 text-sm text-slate-300">{m.end}</td>
                  <td className="px-4 py-3"><Badge variant={m.priority === 'Critical' ? 'danger' : m.priority === 'High' ? 'warning' : m.priority === 'Medium' ? 'info' : 'default'}>{m.priority}</Badge></td>
                  <td className="px-4 py-3"><Badge variant={m.status === 'Completed' ? 'success' : m.status === 'In Progress' ? 'info' : m.status === 'Delayed' ? 'warning' : 'default'}>{m.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Existing Mission Table + Pie Chart + Communication Windows */}
      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <MissionTable missions={missions} />
        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-glow backdrop-blur-xl">
            <p className="mb-4 text-lg font-semibold text-white">Mission Status</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" innerRadius={60} outerRadius={90} paddingAngle={3}>
                    {pieData.map((entry, index) => (<Cell key={entry.name} fill={pieColors[index]} />))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-glow backdrop-blur-xl">
            <p className="mb-4 text-lg font-semibold text-white">Today's Communication Windows</p>
            <div className="space-y-3">
              {communicationWindows.slice(0, 2).map(window => (
                <div key={window.id} className="rounded-2xl border border-white/10 bg-slate-950/50 p-3 text-sm text-slate-300">
                  <p className="font-medium text-white">{window.station}</p>
                  <p className="mt-1">{window.startTime} - {window.endTime}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Satellite Health Summary */}
      <section className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-glow backdrop-blur-xl">
        <p className="mb-4 text-lg font-semibold text-white">Satellite Health Summary</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {satelliteHealthSummaries.slice(0, 10).map(sat => (
            <div key={sat.id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-white">{sat.name}</p>
                <span className={`h-2 w-2 rounded-full ${sat.commStatus === 'Online' ? 'bg-emerald-400' : sat.commStatus === 'Intermittent' ? 'bg-amber-400' : 'bg-red-400'}`} />
              </div>
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Battery</span><span>{sat.batteryHealth}%</span>
                </div>
                <ProgressBar value={sat.batteryHealth} showLabel={false} className="mt-1" />
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant={sat.thermalStatus === 'Nominal' ? 'success' : sat.thermalStatus === 'Warning' ? 'warning' : 'danger'}>{sat.thermalStatus}</Badge>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Existing Resource Utilization + Ground Stations + Recommendations */}
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
              {groundStations.map(station => (
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
              {recommendations.slice(0, 2).map(item => (
                <RecommendationCard key={item.id} recommendation={item} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Weather Impact Summary */}
      <section className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-glow backdrop-blur-xl">
        <p className="mb-4 text-lg font-semibold text-white">Weather Impact Summary</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {weatherImpacts.map(w => (
            <div key={w.station} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
              <div className="flex items-center gap-2">
                <FiCloud className={w.condition === 'Clear' ? 'text-emerald-400' : w.condition === 'Cloudy' ? 'text-amber-400' : w.condition === 'Rainy' ? 'text-sky-400' : 'text-red-400'} />
                <p className="text-sm font-medium text-white">{w.station}</p>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant={w.impact === 'None' ? 'success' : w.impact === 'Low' ? 'info' : w.impact === 'Medium' ? 'warning' : 'danger'}>{w.condition}</Badge>
              </div>
              <p className="mt-2 text-xs text-slate-400">{w.forecast}</p>
              {w.affectedWindows > 0 && <p className="mt-1 text-xs text-amber-400">{w.affectedWindows} windows affected</p>}
            </div>
          ))}
        </div>
      </section>

      {/* Recent Activities Timeline + System Status */}
      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-glow backdrop-blur-xl">
          <p className="mb-4 text-lg font-semibold text-white">Recent Activities</p>
          <div className="space-y-4">
            {recentActivities.slice(0, 8).map((act, i) => (
              <div key={act.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`h-3 w-3 rounded-full ${activityColors[act.type]}`} />
                  {i < 7 && <div className="mt-1 h-full w-px bg-white/10" />}
                </div>
                <div className="pb-4">
                  <p className="text-sm font-medium text-white">{act.title}</p>
                  <p className="mt-0.5 text-xs text-slate-400">{act.description}</p>
                  <p className="mt-1 text-xs text-slate-500">{new Date(act.timestamp).toLocaleString()}{act.user ? ` • ${act.user}` : ''}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-glow backdrop-blur-xl">
          <p className="mb-4 text-lg font-semibold text-white">System Status</p>
          <div className="space-y-3">
            {systemStatus.map(s => (
              <div key={s.name} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/60 p-3">
                <div className="flex items-center gap-3">
                  <span className={`h-2.5 w-2.5 rounded-full ${s.status === 'Operational' ? 'bg-emerald-400' : s.status === 'Degraded' ? 'bg-amber-400' : 'bg-red-400'}`} />
                  <div>
                    <p className="text-sm font-medium text-white">{s.name}</p>
                    <p className="text-xs text-slate-500">Uptime: {s.uptime}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={s.status === 'Operational' ? 'success' : s.status === 'Degraded' ? 'warning' : 'danger'}>{s.status}</Badge>
                  <p className="mt-1 text-xs text-slate-500">{s.latency}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Dashboard;
