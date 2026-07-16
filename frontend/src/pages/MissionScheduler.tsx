import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiClock, FiRefreshCw, FiSearch, FiZap, FiAlertTriangle, FiDownload, FiPlus, FiCheck } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Badge, Button, ProgressBar, Card } from '../components/common/index';
import { useExport } from '../hooks';
import { schedulerSlots, calendarMissions, todaysMissionSchedule } from '../data/extendedMockData';

const priorityColors: Record<string, string> = { Critical: '#ef4444', High: '#f59e0b', Medium: '#38bdf8', Low: '#8b5cf6' };

const MissionScheduler = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [optimized, setOptimized] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [lastUpdated] = useState(new Date().toLocaleTimeString());
  const { exportToCSV, exportToJSON } = useExport();
  const { missions, satellites, payloads, groundStations, triggerRefresh } = useAppContext();

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const monthName = now.toLocaleString('default', { month: 'long', year: 'numeric' });

  const calendarGrid = useMemo(() => {
    const cells: Array<{ day: number | null; missions: typeof calendarMissions }> = [];
    for (let i = 0; i < firstDay; i++) cells.push({ day: null, missions: [] });
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({ day: d, missions: calendarMissions.filter(m => m.date === dateStr) });
    }
    return cells;
  }, [year, month, daysInMonth, firstDay]);

  const filteredMissions = useMemo(() => {
    return missions.slice(0, 30).filter(m => {
      if (search && !m.name.toLowerCase().includes(search.toLowerCase()) && !m.satellite.toLowerCase().includes(search.toLowerCase())) return false;
      if (priorityFilter && m.priority !== priorityFilter) return false;
      if (statusFilter && m.status !== statusFilter) return false;
      return true;
    });
  }, [search, priorityFilter, statusFilter]);

  const conflicts = schedulerSlots.filter(s => s.hasConflict);

  const timelineData = schedulerSlots.map(s => ({
    name: s.missionName.length > 18 ? s.missionName.substring(0, 15) + '...' : s.missionName,
    start: s.startHour,
    duration: s.durationHours,
    priority: s.priority,
    hasConflict: s.hasConflict,
    satellite: s.satellite,
  }));

  const missionsByPriority = [
    { name: 'Critical', value: missions.filter(m => m.priority === 'Critical').length },
    { name: 'High', value: missions.filter(m => m.priority === 'High').length },
    { name: 'Medium', value: missions.filter(m => m.priority === 'Medium').length },
    { name: 'Low', value: missions.filter(m => m.priority === 'Low').length },
  ];

  const runOptimization = () => {
    setOptimizing(true);
    setTimeout(() => { setOptimizing(false); setOptimized(true); }, 2000);
  };

  const todayCompleted = todaysMissionSchedule.filter(m => m.status === 'Completed').length;
  const todayScheduled = todaysMissionSchedule.filter(m => m.status === 'Scheduled').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500">Dashboard &gt; Mission Scheduler</p>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white print:text-black">Mission Scheduler</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400 print:text-slate-700">Interactive timeline and scheduling</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500">Updated {lastUpdated}</span>
          <Button variant="secondary" size="sm" icon={<FiRefreshCw />} onClick={triggerRefresh}>Refresh</Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Total Scheduled', value: String(missions.length), icon: FiCalendar },
          { label: "Today's Missions", value: String(todaysMissionSchedule.length), icon: FiClock },
          { label: 'Pending', value: String(todayScheduled), icon: FiZap },
          { label: 'Completed Today', value: String(todayCompleted), icon: FiCheck },
        ].map(item => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="rounded-3xl border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-800 print:bg-white p-5 shadow-sm dark:shadow-glow print:shadow-none backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600 dark:text-slate-400 print:text-slate-700">{item.label}</p>
                <div className="rounded-xl bg-sky-500/15 p-2 text-sky-600 dark:text-sky-300 print:text-black"><Icon /></div>
              </div>
              <p className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white print:text-black">{item.value}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button variant="primary" icon={<FiPlus />} onClick={() => navigate('/missions')}>Schedule Mission</Button>
        <Button variant="secondary" icon={<FiZap />} onClick={runOptimization} isLoading={optimizing}>
          {optimizing ? 'Optimizing...' : 'Optimize Schedule'}
        </Button>
        <Button variant="secondary" icon={<FiDownload />} onClick={() => exportToCSV(filteredMissions, 'scheduled_missions')}>Export CSV</Button>
        <Button variant="secondary" icon={<FiDownload />} onClick={() => exportToJSON(filteredMissions, 'scheduled_missions')}>Export JSON</Button>
      </div>

      {/* Optimization Result */}
      {optimized && (
        <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-5 shadow-sm dark:shadow-glow print:shadow-none backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <FiCheck className="text-2xl text-emerald-400" />
            <div>
              <p className="font-semibold text-slate-900 dark:text-white print:text-black">Schedule Optimized</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 print:text-slate-700">Reduced conflicts by 75%. Power savings: 18%. Timeline utilization improved to 92%.</p>
            </div>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-800 print:bg-white p-5 shadow-sm dark:shadow-glow print:shadow-none backdrop-blur-xl">
        <p className="mb-4 text-lg font-semibold text-slate-900 dark:text-white print:text-black">Schedule Timeline (24h)</p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={timelineData} layout="vertical" barSize={18}>
              <CartesianGrid stroke="rgba(148,163,184,0.16)" strokeDasharray="4 4" />
              <XAxis type="number" domain={[0, 24]} stroke="currentColor" className="text-slate-600 dark:text-slate-400 print:text-black" ticks={[0, 4, 8, 12, 16, 20, 24]} />
              <YAxis dataKey="name" type="category" stroke="currentColor" className="text-slate-600 dark:text-slate-400 print:text-black" width={130} tick={{ fontSize: 10 }} />
              <Tooltip formatter={(val: any, name: string) => [name === 'start' ? `Hour ${val}` : `${val}h`, name === 'start' ? 'Start' : 'Duration']} />
              <Bar dataKey="start" stackId="a" fill="transparent" />
              <Bar dataKey="duration" stackId="a" radius={[0, 6, 6, 0]}>
                {timelineData.map((entry, i) => (
                  <Cell key={i} fill={entry.hasConflict ? '#ef4444' : priorityColors[entry.priority] || '#38bdf8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Calendar + Conflicts + Distribution */}
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        {/* Calendar */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-800 print:bg-white p-5 shadow-sm dark:shadow-glow print:shadow-none backdrop-blur-xl">
          <p className="mb-4 text-lg font-semibold text-slate-900 dark:text-white print:text-black">{monthName}</p>
          <div className="grid grid-cols-7 gap-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="py-1 text-center text-xs font-semibold text-slate-600 dark:text-slate-400 print:text-slate-700">{d}</div>
            ))}
            {calendarGrid.map((cell: any, i: number) => (
              <div key={i} className={`min-h-[60px] rounded-lg border p-1 ${cell.day ? 'border-slate-200 dark:border-slate-700 print:border-slate-300 bg-slate-50 dark:bg-slate-950/40 print:bg-white' : 'border-transparent'} ${cell.day === now.getDate() ? 'border-sky-500/50 bg-sky-500/10' : ''}`}>
                {cell.day && (
                  <>
                    <p className="text-xs text-slate-600 dark:text-slate-400 print:text-slate-700">{cell.day}</p>
                    <div className="mt-1 flex flex-wrap gap-0.5">
                      {cell.missions.slice(0, 3).map((m: any) => (
                        <span key={m.id} className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: priorityColors[m.priority] }} title={m.name} />
                      ))}
                      {cell.missions.length > 3 && <span className="text-[8px] text-slate-500">+{cell.missions.length - 3}</span>}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {/* Conflicts */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-800 print:bg-white p-5 shadow-sm dark:shadow-glow print:shadow-none backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-4">
              <FiAlertTriangle className="text-amber-400" />
              <p className="text-lg font-semibold text-slate-900 dark:text-white print:text-black">Detected Conflicts ({conflicts.length})</p>
            </div>
            {conflicts.length === 0 ? (
              <p className="text-sm text-slate-600 dark:text-slate-400 print:text-slate-700">No scheduling conflicts detected.</p>
            ) : (
              <div className="space-y-3">
                {conflicts.map(c => {
                  const conflictWith = schedulerSlots.find(s => s.id === c.conflictWith);
                  return (
                    <div key={c.id} className="rounded-2xl border border-red-500/20 bg-red-500/10 p-3">
                      <p className="text-sm font-medium text-slate-900 dark:text-white print:text-black">{c.missionName} ↔ {conflictWith?.missionName}</p>
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 print:text-slate-700">Satellite: {c.satellite} • Overlap: {c.startHour}:00–{c.startHour + c.durationHours}:00</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Distribution */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-800 print:bg-white p-5 shadow-sm dark:shadow-glow print:shadow-none backdrop-blur-xl">
            <p className="mb-4 text-lg font-semibold text-slate-900 dark:text-white print:text-black">Mission Distribution</p>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={missionsByPriority} dataKey="value" innerRadius={40} outerRadius={70} paddingAngle={3}>
                    {missionsByPriority.map(d => <Cell key={d.name} fill={priorityColors[d.name]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Available Resources */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-800 print:bg-white p-5 shadow-sm dark:shadow-glow print:shadow-none backdrop-blur-xl">
          <p className="mb-3 text-sm font-semibold text-slate-900 dark:text-white print:text-black">Available Satellites</p>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {satellites.filter(s => s.status === 'Active').map(s => (
              <div key={s.id} className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-slate-50 dark:bg-slate-800/80 print:bg-white px-3 py-2">
                <span className="text-sm text-slate-900 dark:text-white print:text-black">{s.name}</span>
                <Badge variant="success">Active</Badge>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-800 print:bg-white p-5 shadow-sm dark:shadow-glow print:shadow-none backdrop-blur-xl">
          <p className="mb-3 text-sm font-semibold text-slate-900 dark:text-white print:text-black">Available Payloads</p>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {payloads.filter(p => p.status === 'Active' || p.status === 'Standby').map(p => (
              <div key={p.id} className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-slate-50 dark:bg-slate-800/80 print:bg-white px-3 py-2">
                <span className="text-sm text-slate-900 dark:text-white print:text-black">{p.name}</span>
                <Badge variant={p.status === 'Active' ? 'success' : 'info'}>{p.status}</Badge>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-800 print:bg-white p-5 shadow-sm dark:shadow-glow print:shadow-none backdrop-blur-xl">
          <p className="mb-3 text-sm font-semibold text-slate-900 dark:text-white print:text-black">Available Ground Stations</p>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {groundStations.filter(g => g.status === 'Operational').map(g => (
              <div key={g.id} className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-slate-50 dark:bg-slate-800/80 print:bg-white px-3 py-2">
                <span className="text-sm text-slate-900 dark:text-white print:text-black">{g.name}</span>
                <Badge variant="success">Online</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission Queue Table */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-800 print:bg-white p-5 shadow-sm dark:shadow-glow print:shadow-none backdrop-blur-xl">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-lg font-semibold text-slate-900 dark:text-white print:text-black">Mission Queue</p>
          <div className="flex gap-2">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 dark:text-slate-400 print:text-slate-700" />
              <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="rounded-lg border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-800 py-1.5 pl-9 pr-4 text-sm text-slate-900 dark:text-white print:text-black placeholder-slate-400 dark:placeholder-slate-500 focus:border-sky-500 focus:outline-none" />
            </div>
            <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} className="rounded-lg border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm text-slate-900 dark:text-white print:text-black focus:border-sky-500 focus:outline-none">
              <option value="" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">All Priorities</option>
              <option value="Critical" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Critical</option>
              <option value="High" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">High</option>
              <option value="Medium" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Medium</option>
              <option value="Low" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Low</option>
            </select>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="rounded-lg border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm text-slate-900 dark:text-white print:text-black focus:border-sky-500 focus:outline-none">
              <option value="" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">All Statuses</option>
              <option value="Scheduled" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Scheduled</option>
              <option value="Active" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Active</option>
              <option value="Completed" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Completed</option>
              <option value="Planning" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Planning</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-800">
              <tr>
                {['Mission', 'Satellite', 'Start', 'End', 'Priority', 'Status', 'Duration'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 print:text-slate-700">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5 print:divide-slate-300">
              {filteredMissions.slice(0, 15).map((m: any) => (
                <tr key={m.id} className="transition hover:bg-white dark:bg-slate-800">
                  <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white print:text-black">{m.name}</td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300 print:text-slate-800">{m.satellite}</td>
                  <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-300 print:text-slate-800">{new Date(m.startTime).toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-300 print:text-slate-800">{new Date(m.endTime).toLocaleString()}</td>
                  <td className="px-4 py-3"><Badge variant={m.priority === 'Critical' ? 'danger' : m.priority === 'High' ? 'warning' : m.priority === 'Medium' ? 'info' : 'default'}>{m.priority}</Badge></td>
                  <td className="px-4 py-3"><Badge variant={m.status === 'Completed' ? 'success' : m.status === 'Active' ? 'info' : m.status === 'Failed' ? 'danger' : 'default'}>{m.status}</Badge></td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300 print:text-slate-800">{m.estimatedDuration} min</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MissionScheduler;