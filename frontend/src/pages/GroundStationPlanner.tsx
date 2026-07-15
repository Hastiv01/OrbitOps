import { useState, useMemo } from 'react';
import { FiGlobe, FiWifi, FiClock, FiRefreshCw, FiSearch, FiChevronDown, FiChevronUp, FiDownload } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Badge, Button } from '../components/common/index';
import { useExport } from '../hooks';
import { groundStationPlannerData, communicationQueue, type GroundStationPlannerEntry } from '../data/extendedMockData';

const weatherBadge = (w: string) => {
  const v = w === 'Clear' ? 'success' : w === 'Cloudy' ? 'warning' : w === 'Rainy' ? 'info' : 'danger';
  return <Badge variant={v as any}>{w}</Badge>;
};

const statusBadge = (s: string) => {
  const v = s === 'Operational' ? 'success' : s === 'Maintenance' ? 'warning' : s === 'Reserved' ? 'info' : 'danger';
  return <Badge variant={v as any}>{s}</Badge>;
};

const GroundStationPlanner = () => {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<string>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [selectedStation, setSelectedStation] = useState<GroundStationPlannerEntry | null>(null);
  const [stationStatuses, setStationStatuses] = useState<Record<string, string>>({});
  const [queueSearch, setQueueSearch] = useState('');
  const [lastUpdated] = useState(new Date().toLocaleTimeString());
  const { exportToCSV, exportToJSON } = useExport();

  const getStatus = (gs: GroundStationPlannerEntry) => (stationStatuses[gs.id] || gs.status) as any;

  const filteredStations = useMemo(() => {
    let data = groundStationPlannerData.filter(gs =>
      gs.name.toLowerCase().includes(search.toLowerCase()) ||
      gs.country.toLowerCase().includes(search.toLowerCase())
    );
    data.sort((a, b) => {
      const aVal = (a as any)[sortKey];
      const bVal = (b as any)[sortKey];
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return data;
  }, [search, sortKey, sortDir, stationStatuses]);

  const toggleSort = (key: string) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const filteredQueue = communicationQueue.filter(q =>
    q.satellite.toLowerCase().includes(queueSearch.toLowerCase()) ||
    q.station.toLowerCase().includes(queueSearch.toLowerCase())
  );

  const operationalCount = groundStationPlannerData.filter(g => getStatus(g) === 'Operational').length;
  const maintenanceCount = groundStationPlannerData.filter(g => getStatus(g) === 'Maintenance').length;
  const offlineCount = groundStationPlannerData.filter(g => getStatus(g) === 'Offline' || getStatus(g) === 'Reserved').length;
  const avgAvailability = Math.round(groundStationPlannerData.reduce((s, g) => s + g.availability, 0) / groundStationPlannerData.length);

  const utilizationData = groundStationPlannerData.slice(0, 8).map(gs => ({
    name: gs.name.length > 12 ? gs.name.substring(0, 10) + '...' : gs.name,
    utilization: gs.availability,
    connections: gs.connectedSats,
  }));

  const commLoadData = groundStationPlannerData.map(gs => ({
    name: gs.name.length > 10 ? gs.name.substring(0, 8) + '...' : gs.name,
    load: gs.assignedMissions.length,
  }));

  const availabilityPie = [
    { name: 'Available', value: operationalCount, color: '#10b981' },
    { name: 'Busy', value: maintenanceCount + groundStationPlannerData.filter(g => getStatus(g) === 'Reserved').length, color: '#f59e0b' },
    { name: 'Offline', value: groundStationPlannerData.filter(g => getStatus(g) === 'Offline').length, color: '#ef4444' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500">Dashboard &gt; Ground Station Planner</p>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white print:text-black">Ground Station Planner</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400 print:text-slate-700">Manage ground station availability and assignments</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500">Updated {lastUpdated}</span>
          <Button variant="secondary" size="sm" icon={<FiRefreshCw />} onClick={() => window.location.reload()}>Refresh</Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Ground Stations', value: String(groundStationPlannerData.length), icon: FiGlobe },
          { label: 'Available', value: String(operationalCount), icon: FiWifi },
          { label: 'Avg Availability', value: `${avgAvailability}%`, icon: FiClock },
          { label: 'Weather Alerts', value: String(groundStationPlannerData.filter(g => g.weather === 'Rainy' || g.weather === 'Stormy').length), icon: FiGlobe },
        ].map(item => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="rounded-3xl border border-slate-200 dark:border-white/10 print:border-slate-300 bg-white dark:bg-white/10 print:bg-white p-5 shadow-sm dark:shadow-glow print:shadow-none backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500 dark:text-slate-400 print:text-slate-700">{item.label}</p>
                <div className="rounded-xl bg-sky-500/15 p-2 text-sky-600 dark:text-sky-300 print:text-black"><Icon /></div>
              </div>
              <p className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white print:text-black">{item.value}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button variant="primary" icon={<FiGlobe />}>Assign Station</Button>
        <Button variant="secondary" icon={<FiWifi />}>Optimize Routing</Button>
        <Button variant="secondary" icon={<FiDownload />} onClick={() => exportToCSV(groundStationPlannerData, 'ground_stations')}>Export CSV</Button>
        <Button variant="secondary" icon={<FiDownload />} onClick={() => exportToJSON(groundStationPlannerData, 'ground_stations')}>Export JSON</Button>
      </div>

      {/* Ground Station Table */}
      <div className="rounded-3xl border border-slate-200 dark:border-white/10 print:border-slate-300 bg-white dark:bg-white/10 print:bg-white p-5 shadow-sm dark:shadow-glow print:shadow-none backdrop-blur-xl">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-lg font-semibold text-slate-900 dark:text-white print:text-black">Ground Stations</p>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 print:text-slate-700" />
            <input type="text" placeholder="Search stations..." value={search} onChange={e => setSearch(e.target.value)} className="rounded-lg border border-slate-200 dark:border-white/10 print:border-slate-300 bg-white dark:bg-white/5 py-1.5 pl-9 pr-4 text-sm text-slate-900 dark:text-white print:text-black placeholder-slate-400 dark:placeholder-slate-500 focus:border-sky-500 focus:outline-none" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-200 dark:border-white/10 print:border-slate-300 bg-white dark:bg-white/5">
              <tr>
                {[
                  { key: 'name', label: 'Name' },
                  { key: 'country', label: 'Country' },
                  { key: 'status', label: 'Status' },
                  { key: 'availability', label: 'Avail %' },
                  { key: 'latency', label: 'Latency' },
                  { key: 'bandwidth', label: 'BW (Mbps)' },
                  { key: 'weather', label: 'Weather' },
                  { key: 'coverage', label: 'Coverage %' },
                  { key: 'antennas', label: 'Antennas' },
                ].map(col => (
                  <th key={col.key} className="px-3 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 print:text-slate-700 cursor-pointer hover:text-slate-900 dark:text-white print:text-black transition" onClick={() => toggleSort(col.key)}>
                    {col.label} {sortKey === col.key ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                  </th>
                ))}
                <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 print:text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5 print:divide-slate-300">
              {filteredStations.map(gs => (
                <tr key={gs.id} className={`transition hover:bg-white dark:bg-white/5 cursor-pointer ${selectedStation?.id === gs.id ? 'bg-sky-500/10' : ''}`} onClick={() => setSelectedStation(selectedStation?.id === gs.id ? null : gs)}>
                  <td className="px-3 py-3 text-sm font-medium text-slate-900 dark:text-white print:text-black">{gs.name}</td>
                  <td className="px-3 py-3 text-sm text-slate-600 dark:text-slate-300 print:text-slate-800">{gs.country}</td>
                  <td className="px-3 py-3">{statusBadge(getStatus(gs))}</td>
                  <td className="px-3 py-3 text-sm text-slate-600 dark:text-slate-300 print:text-slate-800">{gs.availability}%</td>
                  <td className="px-3 py-3 text-sm text-slate-600 dark:text-slate-300 print:text-slate-800">{gs.latency}ms</td>
                  <td className="px-3 py-3 text-sm text-slate-600 dark:text-slate-300 print:text-slate-800">{gs.bandwidth}</td>
                  <td className="px-3 py-3">{weatherBadge(gs.weather)}</td>
                  <td className="px-3 py-3 text-sm text-slate-600 dark:text-slate-300 print:text-slate-800">{gs.coverage}%</td>
                  <td className="px-3 py-3 text-sm text-slate-600 dark:text-slate-300 print:text-slate-800">{gs.antennas}</td>
                  <td className="px-3 py-3">
                    <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                      {getStatus(gs) === 'Operational' && (
                        <Button variant="secondary" size="sm" onClick={() => setStationStatuses(prev => ({ ...prev, [gs.id]: 'Reserved' }))}>Reserve</Button>
                      )}
                      {getStatus(gs) === 'Reserved' && (
                        <Button variant="success" size="sm" onClick={() => setStationStatuses(prev => ({ ...prev, [gs.id]: 'Operational' }))}>Release</Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Station Details */}
      {selectedStation && (
        <div className="rounded-3xl border border-sky-500/30 bg-white dark:bg-white/10 print:bg-white p-5 shadow-sm dark:shadow-glow print:shadow-none backdrop-blur-xl">
          <p className="mb-4 text-lg font-semibold text-slate-900 dark:text-white print:text-black">{selectedStation.name} — Details</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 print:border-slate-300 bg-slate-50 dark:bg-slate-950/60 print:bg-white p-3">
              <p className="text-xs text-slate-500 dark:text-slate-400 print:text-slate-700">Country</p>
              <p className="mt-1 text-sm font-medium text-slate-900 dark:text-white print:text-black">{selectedStation.country}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 print:border-slate-300 bg-slate-50 dark:bg-slate-950/60 print:bg-white p-3">
              <p className="text-xs text-slate-500 dark:text-slate-400 print:text-slate-700">Frequency</p>
              <p className="mt-1 text-sm font-medium text-slate-900 dark:text-white print:text-black">{selectedStation.frequency}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 print:border-slate-300 bg-slate-50 dark:bg-slate-950/60 print:bg-white p-3">
              <p className="text-xs text-slate-500 dark:text-slate-400 print:text-slate-700">Next Maintenance</p>
              <p className="mt-1 text-sm font-medium text-slate-900 dark:text-white print:text-black">{selectedStation.nextMaintenance}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 print:border-slate-300 bg-slate-50 dark:bg-slate-950/60 print:bg-white p-3">
              <p className="text-xs text-slate-500 dark:text-slate-400 print:text-slate-700">Connected Satellites</p>
              <p className="mt-1 text-sm font-medium text-slate-900 dark:text-white print:text-black">{selectedStation.connectedSats}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-slate-500 dark:text-slate-400 print:text-slate-700 mb-2">Assigned Missions</p>
            <div className="flex flex-wrap gap-2">
              {selectedStation.assignedMissions.length > 0 ? selectedStation.assignedMissions.map(m => (
                <Badge key={m} variant="info">{m}</Badge>
              )) : <span className="text-sm text-slate-500">No missions assigned</span>}
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 dark:border-white/10 print:border-slate-300 bg-white dark:bg-white/10 print:bg-white p-5 shadow-sm dark:shadow-glow print:shadow-none backdrop-blur-xl">
          <p className="mb-4 text-lg font-semibold text-slate-900 dark:text-white print:text-black">Station Utilization</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={utilizationData}>
                <CartesianGrid stroke="rgba(148,163,184,0.16)" strokeDasharray="4 4" />
                <XAxis dataKey="name" stroke="currentColor" className="text-slate-500 dark:text-slate-400 print:text-black" tick={{ fontSize: 9 }} />
                <YAxis stroke="currentColor" className="text-slate-500 dark:text-slate-400 print:text-black" />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="utilization" fill="#38bdf8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 dark:border-white/10 print:border-slate-300 bg-white dark:bg-white/10 print:bg-white p-5 shadow-sm dark:shadow-glow print:shadow-none backdrop-blur-xl">
          <p className="mb-4 text-lg font-semibold text-slate-900 dark:text-white print:text-black">Communication Load</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={commLoadData.slice(0, 8)}>
                <CartesianGrid stroke="rgba(148,163,184,0.16)" strokeDasharray="4 4" />
                <XAxis dataKey="name" stroke="currentColor" className="text-slate-500 dark:text-slate-400 print:text-black" tick={{ fontSize: 9 }} />
                <YAxis stroke="currentColor" className="text-slate-500 dark:text-slate-400 print:text-black" />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="load" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 dark:border-white/10 print:border-slate-300 bg-white dark:bg-white/10 print:bg-white p-5 shadow-sm dark:shadow-glow print:shadow-none backdrop-blur-xl">
          <p className="mb-4 text-lg font-semibold text-slate-900 dark:text-white print:text-black">Availability</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={availabilityPie} dataKey="value" innerRadius={45} outerRadius={70} paddingAngle={3}>
                  {availabilityPie.map(d => <Cell key={d.name} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-3 mt-2">
            {availabilityPie.map(d => (
              <span key={d.name} className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 print:text-slate-700"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />{d.name} ({d.value})</span>
            ))}
          </div>
        </div>
      </div>

      {/* Communication Queue */}
      <div className="rounded-3xl border border-slate-200 dark:border-white/10 print:border-slate-300 bg-white dark:bg-white/10 print:bg-white p-5 shadow-sm dark:shadow-glow print:shadow-none backdrop-blur-xl">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-lg font-semibold text-slate-900 dark:text-white print:text-black">Communication Schedule</p>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 print:text-slate-700" />
            <input type="text" placeholder="Search..." value={queueSearch} onChange={e => setQueueSearch(e.target.value)} className="rounded-lg border border-slate-200 dark:border-white/10 print:border-slate-300 bg-white dark:bg-white/5 py-1.5 pl-9 pr-4 text-sm text-slate-900 dark:text-white print:text-black placeholder-slate-400 dark:placeholder-slate-500 focus:border-sky-500 focus:outline-none" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-200 dark:border-white/10 print:border-slate-300 bg-white dark:bg-white/5">
              <tr>
                {['ID', 'Satellite', 'Station', 'Time', 'Duration', 'Priority', 'Data', 'Status', 'Type'].map(h => (
                  <th key={h} className="px-3 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 print:text-slate-700">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5 print:divide-slate-300">
              {filteredQueue.map(q => (
                <tr key={q.id} className="transition hover:bg-white dark:bg-white/5">
                  <td className="px-3 py-3 text-xs text-slate-500 dark:text-slate-400 print:text-slate-700">{q.id}</td>
                  <td className="px-3 py-3 text-sm text-slate-900 dark:text-white print:text-black">{q.satellite}</td>
                  <td className="px-3 py-3 text-sm text-slate-600 dark:text-slate-300 print:text-slate-800">{q.station}</td>
                  <td className="px-3 py-3 text-xs text-slate-600 dark:text-slate-300 print:text-slate-800">{new Date(q.scheduledTime).toLocaleString()}</td>
                  <td className="px-3 py-3 text-sm text-slate-600 dark:text-slate-300 print:text-slate-800">{q.duration} min</td>
                  <td className="px-3 py-3"><Badge variant={q.priority === 'Critical' ? 'danger' : q.priority === 'High' ? 'warning' : q.priority === 'Medium' ? 'info' : 'default'}>{q.priority}</Badge></td>
                  <td className="px-3 py-3 text-sm text-slate-600 dark:text-slate-300 print:text-slate-800">{q.dataSize}</td>
                  <td className="px-3 py-3"><Badge variant={q.status === 'Completed' ? 'success' : q.status === 'In Progress' ? 'info' : q.status === 'Failed' ? 'danger' : 'default'}>{q.status}</Badge></td>
                  <td className="px-3 py-3"><Badge variant={q.type === 'Downlink' ? 'info' : 'default'}>{q.type}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GroundStationPlanner;