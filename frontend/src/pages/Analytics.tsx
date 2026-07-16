import { FiRefreshCw, FiDownload, FiPrinter } from 'react-icons/fi';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, Pie, PieChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts';
import { Badge, Button } from '../components/common/index';
import { useExport } from '../hooks';
import { useAppContext } from '../context/AppContext';
import { resourceData } from '../data/dummyData';
import { missionSuccessTrend, missionFailureAnalysis, satelliteUtilization, payloadUtilization, groundStationUsage, missionTypeDistribution, priorityDistribution, riskDistribution, batteryConsumptionTrend, communicationTrend, resourceUsageHeatmap } from '../data/extendedMockData';

const barData = [
  { name: 'Q1', missions: 7 },
  { name: 'Q2', missions: 9 },
  { name: 'Q3', missions: 11 },
  { name: 'Q4', missions: 13 },
];

const pieData = [
  { name: 'Completed', value: 68 },
  { name: 'In Progress', value: 22 },
  { name: 'Delayed', value: 10 },
];

const colors = ['#38bdf8', '#8b5cf6', '#f59e0b'];
const typeColors = ['#38bdf8', '#8b5cf6', '#f59e0b', '#10b981'];

const Analytics = () => {
  const { exportToCSV, exportToJSON } = useExport();
  const { missions, triggerRefresh } = useAppContext();
  const lastUpdated = new Date().toLocaleTimeString();

  const completedMissions = missions.filter(m => m.status === 'Completed').length;
  const completionRate = missions.length > 0 ? Math.round((completedMissions / missions.length) * 100) : 0;

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const heatmapByDayHour: Record<string, Record<number, number>> = {};
  resourceUsageHeatmap.forEach(d => {
    if (!heatmapByDayHour[d.day]) heatmapByDayHour[d.day] = {};
    const h = parseInt(d.hour);
    heatmapByDayHour[d.day][h] = d.value;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500">Dashboard &gt; Analytics</p>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white print:text-black">Analytics</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400 print:text-slate-700">Mission performance and resource analytics</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500">Updated {lastUpdated}</span>
          <Button variant="secondary" size="sm" icon={<FiRefreshCw />} onClick={triggerRefresh}>Refresh</Button>
        </div>
      </div>

      {/* Existing Stat Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: 'Mission Completion Rate', value: `${completionRate}%` },
          { label: 'Resource Utilization', value: '72%' },
          { label: 'Average Response Time', value: '18m' },
        ].map(item => (
          <div key={item.label} className="rounded-3xl border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-800 print:bg-white p-5 shadow-sm dark:shadow-glow print:shadow-none backdrop-blur-xl">
            <p className="text-sm text-slate-600 dark:text-slate-400 print:text-slate-700">{item.label}</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white print:text-black">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Existing Mission Growth + Status */}
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-950/70 p-4 shadow-sm dark:shadow-glow print:shadow-none">
          <p className="mb-4 text-lg font-semibold text-slate-900 dark:text-white print:text-black">Mission Growth</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid stroke="rgba(148, 163, 184, 0.16)" strokeDasharray="4 4" />
                <XAxis dataKey="name" stroke="currentColor" className="text-slate-600 dark:text-slate-400 print:text-black" />
                <YAxis stroke="currentColor" className="text-slate-600 dark:text-slate-400 print:text-black" />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff' }} />
                <Bar isAnimationActive={false} dataKey="missions" fill="#38bdf8" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-950/70 p-4 shadow-sm dark:shadow-glow print:shadow-none">
          <p className="mb-4 text-lg font-semibold text-slate-900 dark:text-white print:text-black">Mission Status</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie isAnimationActive={false} data={pieData} dataKey="value" innerRadius={60} outerRadius={90} paddingAngle={3}>
                  {pieData.map((entry, index) => (<Cell key={entry.name} fill={colors[index]} />))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Mission Success Trend */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-950/70 p-4 shadow-sm dark:shadow-glow print:shadow-none">
        <p className="mb-4 text-lg font-semibold text-slate-900 dark:text-white print:text-black">Mission Success Trend (12 Months)</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={missionSuccessTrend}>
              <CartesianGrid stroke="rgba(148,163,184,0.16)" strokeDasharray="4 4" />
              <XAxis dataKey="month" stroke="currentColor" className="text-slate-600 dark:text-slate-400 print:text-black" />
              <YAxis stroke="currentColor" className="text-slate-600 dark:text-slate-400 print:text-black" />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff' }} />
              <Line isAnimationActive={false} type="monotone" dataKey="success" stroke="#10b981" strokeWidth={2} dot={false} name="Success" />
              <Line isAnimationActive={false} type="monotone" dataKey="failure" stroke="#ef4444" strokeWidth={2} dot={false} name="Failure" />
              <Line isAnimationActive={false} type="monotone" dataKey="partial" stroke="#f59e0b" strokeWidth={2} dot={false} name="Partial" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Failure Analysis + Resource Heatmap */}
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-950/70 p-4 shadow-sm dark:shadow-glow print:shadow-none">
          <p className="mb-4 text-lg font-semibold text-slate-900 dark:text-white print:text-black">Mission Failure Analysis</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={missionFailureAnalysis} layout="vertical">
                <CartesianGrid stroke="rgba(148,163,184,0.16)" strokeDasharray="4 4" />
                <XAxis type="number" stroke="currentColor" className="text-slate-600 dark:text-slate-400 print:text-black" />
                <YAxis dataKey="reason" type="category" stroke="currentColor" className="text-slate-600 dark:text-slate-400 print:text-black" width={100} tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff' }} />
                <Bar isAnimationActive={false} dataKey="count" fill="#ef4444" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-950/70 p-4 shadow-sm dark:shadow-glow print:shadow-none">
          <p className="mb-4 text-lg font-semibold text-slate-900 dark:text-white print:text-black">Resource Usage Heatmap</p>
          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              <div className="flex text-[9px] text-slate-500 pl-10 mb-1">
                {hours.map(h => <div key={h} className="flex-1 text-center">{h}</div>)}
              </div>
              {days.map(day => (
                <div key={day} className="flex items-center">
                  <div className="w-10 text-xs text-slate-600 dark:text-slate-400 print:text-slate-700">{day}</div>
                  <div className="flex flex-1 gap-[1px]">
                    {hours.map(h => {
                      const val = heatmapByDayHour[day]?.[h] || 0;
                      const opacity = Math.max(0.1, val / 100);
                      return <div key={h} className="flex-1 h-5 rounded-sm" style={{ backgroundColor: `rgba(56, 189, 248, ${opacity})` }} title={`${day} ${h}:00 — ${val}%`} />;
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Satellite + Payload + Ground Station Utilization */}
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-950/70 p-4 shadow-sm dark:shadow-glow print:shadow-none">
          <p className="mb-4 text-lg font-semibold text-slate-900 dark:text-white print:text-black">Satellite Utilization</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={satelliteUtilization.slice(0, 8)}>
                <CartesianGrid stroke="rgba(148,163,184,0.16)" strokeDasharray="4 4" />
                <XAxis dataKey="name" stroke="currentColor" className="text-slate-600 dark:text-slate-400 print:text-black" tick={{ fontSize: 9 }} />
                <YAxis stroke="currentColor" className="text-slate-600 dark:text-slate-400 print:text-black" />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff' }} />
                <Bar isAnimationActive={false} dataKey="utilization" fill="#38bdf8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-950/70 p-4 shadow-sm dark:shadow-glow print:shadow-none">
          <p className="mb-4 text-lg font-semibold text-slate-900 dark:text-white print:text-black">Payload Utilization</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={payloadUtilization.slice(0, 8)}>
                <CartesianGrid stroke="rgba(148,163,184,0.16)" strokeDasharray="4 4" />
                <XAxis dataKey="name" stroke="currentColor" className="text-slate-600 dark:text-slate-400 print:text-black" tick={{ fontSize: 9 }} />
                <YAxis stroke="currentColor" className="text-slate-600 dark:text-slate-400 print:text-black" />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff' }} />
                <Bar isAnimationActive={false} dataKey="utilization" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-950/70 p-4 shadow-sm dark:shadow-glow print:shadow-none">
          <p className="mb-4 text-lg font-semibold text-slate-900 dark:text-white print:text-black">Ground Station Usage</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={groundStationUsage}>
                <CartesianGrid stroke="rgba(148,163,184,0.16)" strokeDasharray="4 4" />
                <XAxis dataKey="name" stroke="currentColor" className="text-slate-600 dark:text-slate-400 print:text-black" tick={{ fontSize: 9 }} />
                <YAxis stroke="currentColor" className="text-slate-600 dark:text-slate-400 print:text-black" />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff' }} />
                <Bar isAnimationActive={false} dataKey="usage" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Battery/Power Trend + Communication Trend */}
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-950/70 p-4 shadow-sm dark:shadow-glow print:shadow-none">
          <p className="mb-4 text-lg font-semibold text-slate-900 dark:text-white print:text-black">Battery & Power Trend</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={batteryConsumptionTrend}>
                <CartesianGrid stroke="rgba(148,163,184,0.16)" strokeDasharray="4 4" />
                <XAxis dataKey="time" stroke="currentColor" className="text-slate-600 dark:text-slate-400 print:text-black" />
                <YAxis stroke="currentColor" className="text-slate-600 dark:text-slate-400 print:text-black" />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff' }} />
                <Line isAnimationActive={false} type="monotone" dataKey="consumption" stroke="#ef4444" strokeWidth={2} dot={false} name="Consumption" />
                <Line isAnimationActive={false} type="monotone" dataKey="generation" stroke="#10b981" strokeWidth={2} dot={false} name="Generation" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-950/70 p-4 shadow-sm dark:shadow-glow print:shadow-none">
          <p className="mb-4 text-lg font-semibold text-slate-900 dark:text-white print:text-black">Communication Trend</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={communicationTrend}>
                <CartesianGrid stroke="rgba(148,163,184,0.16)" strokeDasharray="4 4" />
                <XAxis dataKey="time" stroke="currentColor" className="text-slate-600 dark:text-slate-400 print:text-black" />
                <YAxis stroke="currentColor" className="text-slate-600 dark:text-slate-400 print:text-black" />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff' }} />
                <Area isAnimationActive={false} type="monotone" dataKey="uplink" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.2} />
                <Area isAnimationActive={false} type="monotone" dataKey="downlink" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.18} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Existing Resource Usage + Capacity */}
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-950/70 p-4 shadow-sm dark:shadow-glow print:shadow-none">
          <p className="mb-4 text-lg font-semibold text-slate-900 dark:text-white print:text-black">Resource Usage Trend</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={resourceData}>
                <CartesianGrid stroke="rgba(148, 163, 184, 0.16)" strokeDasharray="4 4" />
                <XAxis dataKey="name" stroke="currentColor" className="text-slate-600 dark:text-slate-400 print:text-black" />
                <YAxis stroke="currentColor" className="text-slate-600 dark:text-slate-400 print:text-black" />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff' }} />
                <Line isAnimationActive={false} type="monotone" dataKey="battery" stroke="#38bdf8" strokeWidth={2} dot={false} />
                <Line isAnimationActive={false} type="monotone" dataKey="power" stroke="#8b5cf6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-950/70 p-4 shadow-sm dark:shadow-glow print:shadow-none">
          <p className="mb-4 text-lg font-semibold text-slate-900 dark:text-white print:text-black">Capacity Area</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={resourceData}>
                <CartesianGrid stroke="rgba(148, 163, 184, 0.16)" strokeDasharray="4 4" />
                <XAxis dataKey="name" stroke="currentColor" className="text-slate-600 dark:text-slate-400 print:text-black" />
                <YAxis stroke="currentColor" className="text-slate-600 dark:text-slate-400 print:text-black" />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff' }} />
                <Area isAnimationActive={false} type="monotone" dataKey="storage" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.18} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Distribution Charts */}
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-950/70 p-4 shadow-sm dark:shadow-glow print:shadow-none">
          <p className="mb-4 text-lg font-semibold text-slate-900 dark:text-white print:text-black">Mission Type Distribution</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie isAnimationActive={false} data={missionTypeDistribution} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={3}>
                  {missionTypeDistribution.map((_, i) => <Cell key={i} fill={typeColors[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {missionTypeDistribution.map((d, i) => (
              <span key={d.name} className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400 print:text-slate-700"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: typeColors[i] }} />{d.name}</span>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-950/70 p-4 shadow-sm dark:shadow-glow print:shadow-none">
          <p className="mb-4 text-lg font-semibold text-slate-900 dark:text-white print:text-black">Priority Distribution</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie isAnimationActive={false} data={priorityDistribution} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={3}>
                  {priorityDistribution.map(d => <Cell key={d.name} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {priorityDistribution.map(d => (
              <span key={d.name} className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400 print:text-slate-700"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />{d.name}</span>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-950/70 p-4 shadow-sm dark:shadow-glow print:shadow-none">
          <p className="mb-4 text-lg font-semibold text-slate-900 dark:text-white print:text-black">Risk Distribution</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie isAnimationActive={false} data={riskDistribution} dataKey="value" innerRadius={55} outerRadius={80} paddingAngle={3}>
                  {riskDistribution.map(d => <Cell key={d.name} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {riskDistribution.map(d => (
              <span key={d.name} className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400 print:text-slate-700"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />{d.name}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Export */}
      <div className="flex gap-3">
        <Button variant="secondary" size="md" icon={<FiDownload />} onClick={() => exportToCSV(missionSuccessTrend, 'analytics_mission_trend')}>Export CSV</Button>
        <Button variant="secondary" size="md" icon={<FiDownload />} onClick={() => exportToJSON({ missionSuccessTrend, missionFailureAnalysis, satelliteUtilization }, 'analytics_data')}>Export JSON</Button>
        <Button variant="secondary" size="md" icon={<FiPrinter />} onClick={() => window.print()}>Print Report</Button>
      </div>
    </div>
  );
};

export default Analytics;
