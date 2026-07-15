import { useState, useMemo } from 'react';
import { FiFileText, FiDownload, FiPrinter, FiRefreshCw, FiSearch, FiCalendar, FiAlertTriangle } from 'react-icons/fi';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Badge, Button, Tabs } from '../components/common/index';
import { useExport, useNotification } from '../hooks';
import { missions } from '../data/mockData';
import { missionSuccessTrend, batteryConsumptionTrend, communicationTrend, missionAlerts, systemLogs, reportHistory } from '../data/extendedMockData';

const Reports = () => {
  const [dateFrom, setDateFrom] = useState('2026-07-01');
  const [dateTo, setDateTo] = useState('2026-07-13');
  const [missionFilter, setMissionFilter] = useState('');
  const [satelliteFilter, setSatelliteFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [logSearch, setLogSearch] = useState('');
  const [logLevel, setLogLevel] = useState('');
  const [alertSearch, setAlertSearch] = useState('');
  const [generating, setGenerating] = useState(false);
  const [lastUpdated] = useState(new Date().toLocaleTimeString());
  const { exportToCSV, exportToJSON } = useExport();
  const { addToast } = useNotification();

  const filteredMissions = useMemo(() => {
    return missions.filter(m => {
      if (missionFilter && !m.name.toLowerCase().includes(missionFilter.toLowerCase())) return false;
      if (satelliteFilter && m.satellite !== satelliteFilter) return false;
      if (priorityFilter && m.priority !== priorityFilter) return false;
      return true;
    });
  }, [missionFilter, satelliteFilter, priorityFilter]);

  const filteredLogs = useMemo(() => {
    return systemLogs.filter(l => {
      if (logSearch && !l.message.toLowerCase().includes(logSearch.toLowerCase())) return false;
      if (logLevel && l.level !== logLevel) return false;
      return true;
    });
  }, [logSearch, logLevel]);

  const filteredAlerts = useMemo(() => {
    return missionAlerts.filter(a =>
      !alertSearch || a.title.toLowerCase().includes(alertSearch.toLowerCase()) || a.satellite.toLowerCase().includes(alertSearch.toLowerCase())
    );
  }, [alertSearch]);

  const generateReport = (format: string) => {
    setGenerating(true);
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `Mission_Report_${dateStr}`;
    setTimeout(() => {
      setGenerating(false);
      if (format === 'csv') { exportToCSV(filteredMissions, filename); addToast('CSV Report Downloaded', 'success'); }
      else if (format === 'json') { exportToJSON({ missions: filteredMissions, dateRange: { from: dateFrom, to: dateTo } }, filename); addToast('JSON Report Downloaded', 'success'); }
      else if (format === 'pdf') { 
        // Mock PDF download using a Blob
        const blob = new Blob(['Mission Report PDF Mock Data\n\n' + JSON.stringify(filteredMissions, null, 2)], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
        addToast('PDF Report Generated and Downloaded', 'success'); 
      }
    }, 1500);
  };

  const successRate = [
    { name: 'Success', value: 68, color: '#10b981' },
    { name: 'Partial', value: 22, color: '#f59e0b' },
    { name: 'Failed', value: 10, color: '#ef4444' },
  ];

  const todayCount = reportHistory.filter(r => {
    const d = new Date(r.generatedAt);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  }).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500">Dashboard &gt; Reports</p>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white print:text-black">Reports</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400 print:text-slate-700">Generate and export mission reports</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500">Updated {lastUpdated}</span>
          <Button variant="secondary" size="sm" icon={<FiRefreshCw />} onClick={() => window.location.reload()}>Refresh</Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Total Reports', value: String(reportHistory.length), icon: FiFileText },
          { label: 'Generated Today', value: String(todayCount || 1), icon: FiCalendar },
          { label: 'Critical Events', value: String(missionAlerts.filter(a => a.severity === 'Critical').length), icon: FiAlertTriangle },
          { label: 'Downloads', value: String(reportHistory.length * 3), icon: FiDownload },
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

      {/* Filters + Generate */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-800 print:bg-white p-5 shadow-sm dark:shadow-glow print:shadow-none backdrop-blur-xl">
        <p className="mb-4 text-lg font-semibold text-slate-900 dark:text-white print:text-black">Generate Report</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <label className="block text-xs text-slate-600 dark:text-slate-400 print:text-slate-700 mb-1">Date From</label>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white print:text-black focus:border-sky-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs text-slate-600 dark:text-slate-400 print:text-slate-700 mb-1">Date To</label>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white print:text-black focus:border-sky-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs text-slate-600 dark:text-slate-400 print:text-slate-700 mb-1">Mission</label>
            <input type="text" value={missionFilter} onChange={e => setMissionFilter(e.target.value)} placeholder="Filter mission..." className="w-full rounded-lg border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white print:text-black placeholder-slate-400 dark:placeholder-slate-500 focus:border-sky-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs text-slate-600 dark:text-slate-400 print:text-slate-700 mb-1">Priority</label>
            <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white print:text-black focus:border-sky-500 focus:outline-none">
              <option value="" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">All</option>
              <option value="Critical" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Critical</option>
              <option value="High" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">High</option>
              <option value="Medium" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Medium</option>
              <option value="Low" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Low</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-600 dark:text-slate-400 print:text-slate-700 mb-1">Status</label>
            <select value={satelliteFilter} onChange={e => setSatelliteFilter(e.target.value)} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white print:text-black focus:border-sky-500 focus:outline-none">
              <option value="" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">All</option>
              {[...new Set(missions.map(m => m.satellite))].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button variant="primary" icon={<FiDownload />} isLoading={generating} onClick={() => generateReport('pdf')}>Download Report</Button>
          <Button variant="secondary" icon={<FiDownload />} onClick={() => generateReport('csv')}>Export CSV</Button>
          <Button variant="secondary" icon={<FiDownload />} onClick={() => generateReport('json')}>Export JSON</Button>
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-800 print:bg-white p-5 shadow-sm dark:shadow-glow print:shadow-none backdrop-blur-xl">
          <p className="mb-4 text-lg font-semibold text-slate-900 dark:text-white print:text-black">Mission Statistics</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={missionSuccessTrend.slice(-6)}>
                <CartesianGrid stroke="rgba(148,163,184,0.16)" strokeDasharray="4 4" />
                <XAxis dataKey="month" stroke="currentColor" className="text-slate-600 dark:text-slate-400 print:text-black" />
                <YAxis stroke="currentColor" className="text-slate-600 dark:text-slate-400 print:text-black" />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="success" fill="#10b981" radius={[6, 6, 0, 0]} name="Success" />
                <Bar dataKey="failure" fill="#ef4444" radius={[6, 6, 0, 0]} name="Failure" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-800 print:bg-white p-5 shadow-sm dark:shadow-glow print:shadow-none backdrop-blur-xl">
          <p className="mb-4 text-lg font-semibold text-slate-900 dark:text-white print:text-black">Resource Statistics</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={communicationTrend}>
                <CartesianGrid stroke="rgba(148,163,184,0.16)" strokeDasharray="4 4" />
                <XAxis dataKey="time" stroke="currentColor" className="text-slate-600 dark:text-slate-400 print:text-black" />
                <YAxis stroke="currentColor" className="text-slate-600 dark:text-slate-400 print:text-black" />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff' }} />
                <Area type="monotone" dataKey="uplink" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.15} />
                <Area type="monotone" dataKey="downlink" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.15} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-800 print:bg-white p-5 shadow-sm dark:shadow-glow print:shadow-none backdrop-blur-xl">
          <p className="mb-4 text-lg font-semibold text-slate-900 dark:text-white print:text-black">Battery Trend</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={batteryConsumptionTrend}>
                <CartesianGrid stroke="rgba(148,163,184,0.16)" strokeDasharray="4 4" />
                <XAxis dataKey="time" stroke="currentColor" className="text-slate-600 dark:text-slate-400 print:text-black" />
                <YAxis stroke="currentColor" className="text-slate-600 dark:text-slate-400 print:text-black" />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff' }} />
                <Line type="monotone" dataKey="consumption" stroke="#ef4444" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="generation" stroke="#10b981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-800 print:bg-white p-5 shadow-sm dark:shadow-glow print:shadow-none backdrop-blur-xl">
          <p className="mb-4 text-lg font-semibold text-slate-900 dark:text-white print:text-black">Mission Success Rate</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={successRate} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={3}>
                  {successRate.map(d => <Cell key={d.name} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-3 mt-2">
            {successRate.map(d => (
              <span key={d.name} className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400 print:text-slate-700"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />{d.name}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Tables */}
      <Tabs tabs={[
        {
          id: 'missions',
          label: 'Mission Logs',
          content: (
            <div className="rounded-3xl border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-800 print:bg-white p-5 shadow-sm dark:shadow-glow print:shadow-none backdrop-blur-xl">
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
                    {filteredMissions.slice(0, 15).map(m => (
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
          ),
        },
        {
          id: 'system',
          label: 'System Logs',
          content: (
            <div className="rounded-3xl border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-800 print:bg-white p-5 shadow-sm dark:shadow-glow print:shadow-none backdrop-blur-xl">
              <div className="mb-4 flex gap-2">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 dark:text-slate-400 print:text-slate-700" />
                  <input type="text" placeholder="Search logs..." value={logSearch} onChange={e => setLogSearch(e.target.value)} className="rounded-lg border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-800 py-1.5 pl-9 pr-4 text-sm text-slate-900 dark:text-white print:text-black placeholder-slate-400 dark:placeholder-slate-500 focus:border-sky-500 focus:outline-none" />
                </div>
                <select value={logLevel} onChange={e => setLogLevel(e.target.value)} className="rounded-lg border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm text-slate-900 dark:text-white print:text-black focus:border-sky-500 focus:outline-none">
                  <option value="" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">All</option>
                  <option value="INFO" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">INFO</option>
                  <option value="WARN" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">WARN</option>
                  <option value="ERROR" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">ERROR</option>
                </select>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-800">
                    <tr>
                      {['Timestamp', 'Level', 'Source', 'Message'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 print:text-slate-700">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-white/5 print:divide-slate-300">
                    {filteredLogs.map(log => (
                      <tr key={log.id} className="transition hover:bg-white dark:bg-slate-800">
                        <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-400 print:text-slate-700 whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                        <td className="px-4 py-3"><Badge variant={log.level === 'ERROR' ? 'danger' : log.level === 'WARN' ? 'warning' : 'info'}>{log.level}</Badge></td>
                        <td className="px-4 py-3 text-sm text-sky-400">{log.source}</td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300 print:text-slate-800">{log.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ),
        },
        {
          id: 'alerts',
          label: 'Alerts',
          content: (
            <div className="rounded-3xl border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-800 print:bg-white p-5 shadow-sm dark:shadow-glow print:shadow-none backdrop-blur-xl">
              <div className="mb-4">
                <div className="relative max-w-xs">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 dark:text-slate-400 print:text-slate-700" />
                  <input type="text" placeholder="Search alerts..." value={alertSearch} onChange={e => setAlertSearch(e.target.value)} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-800 py-1.5 pl-9 pr-4 text-sm text-slate-900 dark:text-white print:text-black placeholder-slate-400 dark:placeholder-slate-500 focus:border-sky-500 focus:outline-none" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-800">
                    <tr>
                      {['Type', 'Severity', 'Title', 'Satellite', 'Timestamp', 'Acknowledged'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 print:text-slate-700">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-white/5 print:divide-slate-300">
                    {filteredAlerts.map(a => (
                      <tr key={a.id} className="transition hover:bg-white dark:bg-slate-800">
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300 print:text-slate-800">{a.type}</td>
                        <td className="px-4 py-3"><Badge variant={a.severity === 'Critical' ? 'danger' : a.severity === 'High' ? 'warning' : a.severity === 'Medium' ? 'info' : 'default'}>{a.severity}</Badge></td>
                        <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white print:text-black">{a.title}</td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300 print:text-slate-800">{a.satellite}</td>
                        <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-400 print:text-slate-700">{new Date(a.timestamp).toLocaleString()}</td>
                        <td className="px-4 py-3"><Badge variant={a.acknowledged ? 'success' : 'danger'}>{a.acknowledged ? 'Yes' : 'No'}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ),
        },
      ]} defaultTab="missions" />

      {/* Report History */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-800 print:bg-white p-5 shadow-sm dark:shadow-glow print:shadow-none backdrop-blur-xl">
        <p className="mb-4 text-lg font-semibold text-slate-900 dark:text-white print:text-black">Report History</p>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-800">
              <tr>
                {['Report Name', 'Category', 'Generated', 'By', 'Format', 'Size', 'Period', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 print:text-slate-700">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5 print:divide-slate-300">
              {reportHistory.map(r => (
                <tr key={r.id} className="transition hover:bg-white dark:bg-slate-800">
                  <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white print:text-black">{r.name}</td>
                  <td className="px-4 py-3"><Badge variant="info">{r.category}</Badge></td>
                  <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-400 print:text-slate-700">{new Date(r.generatedAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300 print:text-slate-800">{r.generatedBy}</td>
                  <td className="px-4 py-3"><Badge variant="default">{r.format}</Badge></td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300 print:text-slate-800">{r.size}</td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300 print:text-slate-800">{r.period}</td>
                  <td className="px-4 py-3"><Badge variant={r.status === 'Ready' ? 'success' : r.status === 'Generating' ? 'warning' : 'danger'}>{r.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;