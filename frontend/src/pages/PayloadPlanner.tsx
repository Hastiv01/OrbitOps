import { useState, useMemo } from 'react';
import { FiCpu, FiZap, FiHardDrive, FiRefreshCw, FiSearch, FiDownload, FiPlay, FiPause, FiTool, FiClock } from 'react-icons/fi';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Badge, Button, ProgressBar } from '../components/common/index';
import { useExport } from '../hooks';
import { payloadPlannerData, payloadHistory, type PayloadPlannerEntry } from '../data/extendedMockData';

const PayloadPlanner = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortKey, setSortKey] = useState<string>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [selectedPayload, setSelectedPayload] = useState<PayloadPlannerEntry | null>(null);
  const [payloadStatuses, setPayloadStatuses] = useState<Record<string, string>>({});
  const [lastUpdated] = useState(new Date().toLocaleTimeString());
  const { exportToCSV, exportToJSON } = useExport();

  const getStatus = (p: PayloadPlannerEntry) => (payloadStatuses[p.id] || p.status) as any;

  const filteredPayloads = useMemo(() => {
    let data = payloadPlannerData.filter(p => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.assignedSatellite.toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter && getStatus(p) !== statusFilter) return false;
      return true;
    });
    data.sort((a, b) => {
      const aVal = (a as any)[sortKey];
      const bVal = (b as any)[sortKey];
      if (typeof aVal === 'string') return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return data;
  }, [search, statusFilter, sortKey, sortDir, payloadStatuses]);

  const toggleSort = (key: string) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const activeCount = payloadPlannerData.filter(p => getStatus(p) === 'Active').length;
  const standbyCount = payloadPlannerData.filter(p => getStatus(p) === 'Standby').length;
  const maintenanceCount = payloadPlannerData.filter(p => getStatus(p) === 'Maintenance').length;

  const usageData = payloadPlannerData.slice(0, 10).map(p => ({
    name: p.name.length > 12 ? p.name.substring(0, 10) + '...' : p.name,
    hours: p.operationalHours,
  }));

  const powerData = payloadPlannerData.slice(0, 10).map(p => ({
    name: p.name.length > 12 ? p.name.substring(0, 10) + '...' : p.name,
    power: p.power,
  }));

  const memoryData = payloadPlannerData.slice(0, 10).map(p => ({
    name: p.name.length > 12 ? p.name.substring(0, 10) + '...' : p.name,
    memory: p.storage,
  }));

  const timelineData = payloadPlannerData.slice(0, 8).map(p => ({
    name: p.name.length > 15 ? p.name.substring(0, 12) + '...' : p.name,
    operational: p.operationalHours,
    remaining: Math.max(0, 1500 - p.operationalHours),
  }));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500">Dashboard &gt; Payload Planner</p>
          <h1 className="text-3xl font-bold text-white">Payload Planner</h1>
          <p className="mt-1 text-slate-400">Manage payload assignments and schedules</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500">Updated {lastUpdated}</span>
          <Button variant="secondary" size="sm" icon={<FiRefreshCw />} onClick={() => window.location.reload()}>Refresh</Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Total Payloads', value: String(payloadPlannerData.length), icon: FiCpu },
          { label: 'Active', value: String(activeCount), icon: FiPlay },
          { label: 'Standby', value: String(standbyCount), icon: FiPause },
          { label: 'Maintenance', value: String(maintenanceCount), icon: FiTool },
        ].map(item => {
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

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button variant="primary" icon={<FiCpu />}>Assign Payload</Button>
        <Button variant="secondary" icon={<FiClock />}>Schedule Payload</Button>
        <Button variant="secondary" icon={<FiTool />}>Request Maintenance</Button>
        <Button variant="secondary" icon={<FiDownload />} onClick={() => exportToCSV(payloadPlannerData, 'payloads')}>Export CSV</Button>
        <Button variant="secondary" icon={<FiDownload />} onClick={() => exportToJSON(payloadPlannerData, 'payloads')}>Export JSON</Button>
      </div>

      {/* Payload Table */}
      <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-glow backdrop-blur-xl">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-lg font-semibold text-white">Payload List</p>
          <div className="flex gap-2">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search payloads..." value={search} onChange={e => setSearch(e.target.value)} className="rounded-lg border border-white/10 bg-white/5 py-1.5 pl-9 pr-4 text-sm text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none" />
            </div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white focus:border-sky-500 focus:outline-none">
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Standby">Standby</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Error">Error</option>
              <option value="Offline">Offline</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-white/10 bg-white/5">
              <tr>
                {[
                  { key: 'name', label: 'Payload' },
                  { key: 'assignedSatellite', label: 'Satellite' },
                  { key: 'type', label: 'Type' },
                  { key: 'power', label: 'Power (W)' },
                  { key: 'storage', label: 'Memory (MB)' },
                  { key: 'temperature', label: 'Temp (°C)' },
                  { key: 'status', label: 'Status' },
                ].map(col => (
                  <th key={col.key} className="px-3 py-3 text-left text-xs font-semibold text-slate-400 cursor-pointer hover:text-white transition" onClick={() => toggleSort(col.key)}>
                    {col.label} {sortKey === col.key ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                  </th>
                ))}
                <th className="px-3 py-3 text-left text-xs font-semibold text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredPayloads.map(p => (
                <tr key={p.id} className={`transition hover:bg-white/5 cursor-pointer ${selectedPayload?.id === p.id ? 'bg-sky-500/10' : ''}`} onClick={() => setSelectedPayload(selectedPayload?.id === p.id ? null : p)}>
                  <td className="px-3 py-3 text-sm font-medium text-white">{p.name}</td>
                  <td className="px-3 py-3 text-sm text-slate-300">{p.assignedSatellite}</td>
                  <td className="px-3 py-3 text-sm text-slate-300">{p.type}</td>
                  <td className="px-3 py-3 text-sm text-slate-300">{p.power}W</td>
                  <td className="px-3 py-3 text-sm text-slate-300">{p.storage}MB</td>
                  <td className="px-3 py-3 text-sm text-slate-300">{p.temperature}°C</td>
                  <td className="px-3 py-3"><Badge variant={getStatus(p) === 'Active' ? 'success' : getStatus(p) === 'Standby' ? 'info' : getStatus(p) === 'Maintenance' ? 'warning' : 'danger'}>{getStatus(p)}</Badge></td>
                  <td className="px-3 py-3">
                    <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                      {(getStatus(p) === 'Standby' || getStatus(p) === 'Offline') && (
                        <Button variant="success" size="sm" icon={<FiPlay />} onClick={() => setPayloadStatuses(prev => ({ ...prev, [p.id]: 'Active' }))}>Activate</Button>
                      )}
                      {getStatus(p) === 'Active' && (
                        <Button variant="secondary" size="sm" icon={<FiPause />} onClick={() => setPayloadStatuses(prev => ({ ...prev, [p.id]: 'Standby' }))}>Deactivate</Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Payload Details */}
      {selectedPayload && (
        <div className="rounded-3xl border border-sky-500/30 bg-white/10 p-5 shadow-glow backdrop-blur-xl">
          <p className="mb-4 text-lg font-semibold text-white">{selectedPayload.name} — Details</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
              <p className="text-xs text-slate-400">Mission</p>
              <p className="mt-1 text-sm font-medium text-white">{selectedPayload.assignedMission}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
              <p className="text-xs text-slate-400">Operational Hours</p>
              <p className="mt-1 text-sm font-medium text-white">{selectedPayload.operationalHours}h</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
              <p className="text-xs text-slate-400">Storage Used</p>
              <p className="mt-1 text-sm font-medium text-white">{selectedPayload.storage} / {selectedPayload.storageCapacity} MB</p>
              <ProgressBar value={selectedPayload.storage} max={selectedPayload.storageCapacity} showLabel={false} className="mt-2" />
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
              <p className="text-xs text-slate-400">Data Collected</p>
              <p className="mt-1 text-sm font-medium text-white">{selectedPayload.dataCollected} GB</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
              <p className="text-xs text-slate-400">Last Activated</p>
              <p className="mt-1 text-xs text-white">{new Date(selectedPayload.lastActivated).toLocaleString()}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
              <p className="text-xs text-slate-400">Next Maintenance</p>
              <p className="mt-1 text-xs text-white">{new Date(selectedPayload.nextMaintenance).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-glow backdrop-blur-xl">
          <p className="mb-4 text-lg font-semibold text-white">Payload Usage (Hours)</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={usageData}>
                <CartesianGrid stroke="rgba(148,163,184,0.16)" strokeDasharray="4 4" />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 9 }} />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="hours" fill="#38bdf8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-glow backdrop-blur-xl">
          <p className="mb-4 text-lg font-semibold text-white">Power Consumption (W)</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={powerData}>
                <CartesianGrid stroke="rgba(148,163,184,0.16)" strokeDasharray="4 4" />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 9 }} />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="power" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-glow backdrop-blur-xl">
          <p className="mb-4 text-lg font-semibold text-white">Memory Usage (MB)</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={memoryData}>
                <CartesianGrid stroke="rgba(148,163,184,0.16)" strokeDasharray="4 4" />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 9 }} />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="memory" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-glow backdrop-blur-xl">
          <p className="mb-4 text-lg font-semibold text-white">Payload Timeline (Hours)</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timelineData} layout="vertical" barSize={14}>
                <CartesianGrid stroke="rgba(148,163,184,0.16)" strokeDasharray="4 4" />
                <XAxis type="number" stroke="#94a3b8" />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" width={100} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="operational" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} name="Operational" />
                <Bar dataKey="remaining" stackId="a" fill="#334155" radius={[0, 6, 6, 0]} name="Remaining" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Payload History */}
      <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-glow backdrop-blur-xl">
        <p className="mb-4 text-lg font-semibold text-white">Payload History</p>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-white/10 bg-white/5">
              <tr>
                {['Payload', 'Action', 'Timestamp', 'Operator', 'Notes'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {payloadHistory.map(h => {
                const payload = payloadPlannerData.find(p => p.id === h.payloadId);
                return (
                  <tr key={h.id} className="transition hover:bg-white/5">
                    <td className="px-4 py-3 text-sm font-medium text-white">{payload?.name || h.payloadId}</td>
                    <td className="px-4 py-3"><Badge variant={h.action === 'Activated' ? 'success' : h.action === 'Deactivated' ? 'default' : h.action === 'Error' ? 'danger' : h.action === 'Maintenance' ? 'warning' : 'info'}>{h.action}</Badge></td>
                    <td className="px-4 py-3 text-xs text-slate-400">{new Date(h.timestamp).toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-slate-300">{h.operator}</td>
                    <td className="px-4 py-3 text-sm text-slate-400">{h.notes}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PayloadPlanner;