import { useState, useMemo } from 'react';
import { FiCpu, FiZap, FiHardDrive, FiRefreshCw, FiSearch, FiDownload, FiPlay, FiPause, FiTool, FiClock } from 'react-icons/fi';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Badge, Button, ProgressBar, Modal, Input, Select, TextArea } from '../components/common/index';
import { useExport, useNotification } from '../hooks';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { payloadPlannerData, payloadHistory, type PayloadPlannerEntry } from '../data/extendedMockData';

const PayloadPlanner = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortKey, setSortKey] = useState<string>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [selectedPayload, setSelectedPayload] = useState<PayloadPlannerEntry | null>(null);
  const [payloadStatuses, setPayloadStatuses] = useState<Record<string, string>>({});
  const [lastUpdated] = useState(new Date().toLocaleTimeString());

  // Modal States
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);

  // Form States
  const [assignForm, setAssignForm] = useState({ name: '', type: 'Camera', satellite: '', weight: '', power: '', dataRate: '' });
  const [scheduleForm, setScheduleForm] = useState({ payload: '', satellite: '', date: '', startTime: '', endTime: '', priority: 'Medium' });
  const [maintenanceForm, setMaintenanceForm] = useState({ payload: '', type: 'Routine', reason: '', priority: 'Medium' });
  const { exportToCSV, exportToJSON } = useExport();
  const { addToast } = useNotification();
  const { triggerRefresh } = useAppContext();
  const navigate = useNavigate();

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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white print:text-black">Payload Planner</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400 print:text-slate-700">Manage payload assignments and schedules</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500">Updated {lastUpdated}</span>
          <Button variant="secondary" size="sm" icon={<FiRefreshCw />} onClick={triggerRefresh}>Refresh</Button>
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
        <Button variant="primary" icon={<FiCpu />} onClick={() => setShowAssignModal(true)}>Assign Payload</Button>
        <Button variant="secondary" icon={<FiClock />} onClick={() => setShowScheduleModal(true)}>Schedule Payload</Button>
        <Button variant="secondary" icon={<FiTool />} onClick={() => setShowMaintenanceModal(true)}>Request Maintenance</Button>
        <Button variant="secondary" icon={<FiDownload />} onClick={() => { exportToCSV(payloadPlannerData, 'payloads'); addToast('CSV file downloaded successfully', 'success'); }}>Export CSV</Button>
        <Button variant="secondary" icon={<FiDownload />} onClick={() => { exportToJSON(payloadPlannerData, 'payloads'); addToast('JSON file downloaded successfully', 'success'); }}>Export JSON</Button>
      </div>

      {/* Payload Table */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-800 print:bg-white p-5 shadow-sm dark:shadow-glow print:shadow-none backdrop-blur-xl">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-lg font-semibold text-slate-900 dark:text-white print:text-black">Payload List</p>
          <div className="flex gap-2">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 dark:text-slate-400 print:text-slate-700" />
              <input type="text" placeholder="Search payloads..." value={search} onChange={e => setSearch(e.target.value)} className="rounded-lg border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-800 py-1.5 pl-9 pr-4 text-sm text-slate-900 dark:text-white print:text-black placeholder-slate-400 dark:placeholder-slate-500 focus:border-sky-500 focus:outline-none" />
            </div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="rounded-lg border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm text-slate-900 dark:text-white print:text-black focus:border-sky-500 focus:outline-none">
              <option value="" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">All Statuses</option>
              <option value="Active" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Active</option>
              <option value="Standby" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Standby</option>
              <option value="Maintenance" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Maintenance</option>
              <option value="Error" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Error</option>
              <option value="Offline" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Offline</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-800">
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
                  <th key={col.key} className="px-3 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 print:text-slate-700 cursor-pointer hover:text-slate-900 dark:text-white print:text-black transition" onClick={() => toggleSort(col.key)}>
                    {col.label} {sortKey === col.key ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                  </th>
                ))}
                <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 print:text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5 print:divide-slate-300">
              {filteredPayloads.map(p => (
                <tr key={p.id} className={`transition hover:bg-white dark:bg-slate-800 cursor-pointer ${selectedPayload?.id === p.id ? 'bg-sky-500/10' : ''}`} onClick={() => setSelectedPayload(selectedPayload?.id === p.id ? null : p)}>
                  <td className="px-3 py-3 text-sm font-medium text-slate-900 dark:text-white print:text-black">{p.name}</td>
                  <td className="px-3 py-3 text-sm text-slate-600 dark:text-slate-300 print:text-slate-800">{p.assignedSatellite}</td>
                  <td className="px-3 py-3 text-sm text-slate-600 dark:text-slate-300 print:text-slate-800">{p.type}</td>
                  <td className="px-3 py-3 text-sm text-slate-600 dark:text-slate-300 print:text-slate-800">{p.power}W</td>
                  <td className="px-3 py-3 text-sm text-slate-600 dark:text-slate-300 print:text-slate-800">{p.storage}MB</td>
                  <td className="px-3 py-3 text-sm text-slate-600 dark:text-slate-300 print:text-slate-800">{p.temperature}°C</td>
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
        <div className="rounded-3xl border border-sky-500/30 bg-white dark:bg-slate-800 print:bg-white p-5 shadow-sm dark:shadow-glow print:shadow-none backdrop-blur-xl">
          <p className="mb-4 text-lg font-semibold text-slate-900 dark:text-white print:text-black">{selectedPayload.name} — Details</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-slate-50 dark:bg-slate-800/80 print:bg-white p-3">
              <p className="text-xs text-slate-600 dark:text-slate-400 print:text-slate-700">Mission</p>
              <p className="mt-1 text-sm font-medium text-slate-900 dark:text-white print:text-black">{selectedPayload.assignedMission}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-slate-50 dark:bg-slate-800/80 print:bg-white p-3">
              <p className="text-xs text-slate-600 dark:text-slate-400 print:text-slate-700">Operational Hours</p>
              <p className="mt-1 text-sm font-medium text-slate-900 dark:text-white print:text-black">{selectedPayload.operationalHours}h</p>
            </div>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-slate-50 dark:bg-slate-800/80 print:bg-white p-3">
              <p className="text-xs text-slate-600 dark:text-slate-400 print:text-slate-700">Storage Used</p>
              <p className="mt-1 text-sm font-medium text-slate-900 dark:text-white print:text-black">{selectedPayload.storage} / {selectedPayload.storageCapacity} MB</p>
              <ProgressBar value={selectedPayload.storage} max={selectedPayload.storageCapacity} showLabel={false} className="mt-2" />
            </div>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-slate-50 dark:bg-slate-800/80 print:bg-white p-3">
              <p className="text-xs text-slate-600 dark:text-slate-400 print:text-slate-700">Data Collected</p>
              <p className="mt-1 text-sm font-medium text-slate-900 dark:text-white print:text-black">{selectedPayload.dataCollected} GB</p>
            </div>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-slate-50 dark:bg-slate-800/80 print:bg-white p-3">
              <p className="text-xs text-slate-600 dark:text-slate-400 print:text-slate-700">Last Activated</p>
              <p className="mt-1 text-xs text-slate-900 dark:text-white print:text-black">{new Date(selectedPayload.lastActivated).toLocaleString()}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-slate-50 dark:bg-slate-800/80 print:bg-white p-3">
              <p className="text-xs text-slate-600 dark:text-slate-400 print:text-slate-700">Next Maintenance</p>
              <p className="mt-1 text-xs text-slate-900 dark:text-white print:text-black">{new Date(selectedPayload.nextMaintenance).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-800 print:bg-white p-5 shadow-sm dark:shadow-glow print:shadow-none backdrop-blur-xl">
          <p className="mb-4 text-lg font-semibold text-slate-900 dark:text-white print:text-black">Payload Usage (Hours)</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={usageData}>
                <CartesianGrid stroke="rgba(148,163,184,0.16)" strokeDasharray="4 4" />
                <XAxis dataKey="name" stroke="currentColor" className="text-slate-600 dark:text-slate-400 print:text-black" tick={{ fontSize: 9 }} />
                <YAxis stroke="currentColor" className="text-slate-600 dark:text-slate-400 print:text-black" />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="hours" fill="#38bdf8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-800 print:bg-white p-5 shadow-sm dark:shadow-glow print:shadow-none backdrop-blur-xl">
          <p className="mb-4 text-lg font-semibold text-slate-900 dark:text-white print:text-black">Power Consumption (W)</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={powerData}>
                <CartesianGrid stroke="rgba(148,163,184,0.16)" strokeDasharray="4 4" />
                <XAxis dataKey="name" stroke="currentColor" className="text-slate-600 dark:text-slate-400 print:text-black" tick={{ fontSize: 9 }} />
                <YAxis stroke="currentColor" className="text-slate-600 dark:text-slate-400 print:text-black" />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="power" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-800 print:bg-white p-5 shadow-sm dark:shadow-glow print:shadow-none backdrop-blur-xl">
          <p className="mb-4 text-lg font-semibold text-slate-900 dark:text-white print:text-black">Memory Usage (MB)</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={memoryData}>
                <CartesianGrid stroke="rgba(148,163,184,0.16)" strokeDasharray="4 4" />
                <XAxis dataKey="name" stroke="currentColor" className="text-slate-600 dark:text-slate-400 print:text-black" tick={{ fontSize: 9 }} />
                <YAxis stroke="currentColor" className="text-slate-600 dark:text-slate-400 print:text-black" />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="memory" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-800 print:bg-white p-5 shadow-sm dark:shadow-glow print:shadow-none backdrop-blur-xl">
          <p className="mb-4 text-lg font-semibold text-slate-900 dark:text-white print:text-black">Payload Timeline (Hours)</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timelineData} layout="vertical" barSize={14}>
                <CartesianGrid stroke="rgba(148,163,184,0.16)" strokeDasharray="4 4" />
                <XAxis type="number" stroke="currentColor" className="text-slate-600 dark:text-slate-400 print:text-black" />
                <YAxis dataKey="name" type="category" stroke="currentColor" className="text-slate-600 dark:text-slate-400 print:text-black" width={100} tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="operational" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} name="Operational" />
                <Bar dataKey="remaining" stackId="a" fill="#334155" radius={[0, 6, 6, 0]} name="Remaining" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Payload History */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-800 print:bg-white p-5 shadow-sm dark:shadow-glow print:shadow-none backdrop-blur-xl">
        <p className="mb-4 text-lg font-semibold text-slate-900 dark:text-white print:text-black">Payload History</p>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-800">
              <tr>
                {['Payload', 'Action', 'Timestamp', 'Operator', 'Notes'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 print:text-slate-700">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5 print:divide-slate-300">
              {payloadHistory.map(h => {
                const payload = payloadPlannerData.find(p => p.id === h.payloadId);
                return (
                  <tr key={h.id} className="transition hover:bg-white dark:bg-slate-800">
                    <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white print:text-black">{payload?.name || h.payloadId}</td>
                    <td className="px-4 py-3"><Badge variant={h.action === 'Activated' ? 'success' : h.action === 'Deactivated' ? 'default' : h.action === 'Error' ? 'danger' : h.action === 'Maintenance' ? 'warning' : 'info'}>{h.action}</Badge></td>
                    <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-400 print:text-slate-700">{new Date(h.timestamp).toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300 print:text-slate-800">{h.operator}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400 print:text-slate-700">{h.notes}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={showAssignModal} onClose={() => setShowAssignModal(false)} title="Assign Payload" size="md">
        <div className="space-y-4">
          <Input label="Payload Name" value={assignForm.name} onChange={e => setAssignForm({ ...assignForm, name: e.target.value })} placeholder="e.g., High-Res Optical Imager" />
          <Select label="Payload Type" value={assignForm.type} onChange={e => setAssignForm({ ...assignForm, type: e.target.value })} options={[
            { value: 'Camera', label: 'Camera' },
            { value: 'Radar', label: 'Radar' },
            { value: 'Thermal Sensor', label: 'Thermal Sensor' },
            { value: 'Spectrometer', label: 'Spectrometer' },
            { value: 'Communication', label: 'Communication' }
          ]} />
          <Select label="Target Satellite" value={assignForm.satellite} onChange={e => setAssignForm({ ...assignForm, satellite: e.target.value })} options={[
            { value: '', label: 'Select Satellite' },
            { value: 'Astra-7', label: 'Astra-7' },
            { value: 'Nova-2', label: 'Nova-2' },
            { value: 'Orion-4', label: 'Orion-4' }
          ]} />
          <div className="grid grid-cols-3 gap-4">
            <Input label="Weight (kg)" value={assignForm.weight} onChange={e => setAssignForm({ ...assignForm, weight: e.target.value })} type="number" />
            <Input label="Power (W)" value={assignForm.power} onChange={e => setAssignForm({ ...assignForm, power: e.target.value })} type="number" />
            <Input label="Data Rate" value={assignForm.dataRate} onChange={e => setAssignForm({ ...assignForm, dataRate: e.target.value })} placeholder="e.g., 50 Mbps" />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="ghost" onClick={() => setShowAssignModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => {
              if (!assignForm.name || !assignForm.satellite) return addToast('Please fill all required fields', 'error');
              addToast(`Payload ${assignForm.name} assigned to ${assignForm.satellite}`, 'success');
              setShowAssignModal(false);
            }}>Save Assignment</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showScheduleModal} onClose={() => setShowScheduleModal(false)} title="Schedule Payload" size="md">
        <div className="space-y-4">
          <Select label="Payload" value={scheduleForm.payload} onChange={e => setScheduleForm({ ...scheduleForm, payload: e.target.value })} options={[
            { value: '', label: 'Select Payload' },
            ...payloadPlannerData.map(p => ({ value: p.name, label: p.name }))
          ]} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Date" value={scheduleForm.date} onChange={e => setScheduleForm({ ...scheduleForm, date: e.target.value })} type="date" />
            <Select label="Priority" value={scheduleForm.priority} onChange={e => setScheduleForm({ ...scheduleForm, priority: e.target.value })} options={[
              { value: 'Low', label: 'Low' },
              { value: 'Medium', label: 'Medium' },
              { value: 'High', label: 'High' },
              { value: 'Critical', label: 'Critical' }
            ]} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Time" value={scheduleForm.startTime} onChange={e => setScheduleForm({ ...scheduleForm, startTime: e.target.value })} type="time" />
            <Input label="End Time" value={scheduleForm.endTime} onChange={e => setScheduleForm({ ...scheduleForm, endTime: e.target.value })} type="time" />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="ghost" onClick={() => setShowScheduleModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => {
              if (!scheduleForm.payload || !scheduleForm.date || !scheduleForm.startTime) return addToast('Please fill all required fields', 'error');
              addToast(`Payload ${scheduleForm.payload} scheduled successfully`, 'success');
              setShowScheduleModal(false);
            }}>Save Schedule</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showMaintenanceModal} onClose={() => setShowMaintenanceModal(false)} title="Request Maintenance" size="md">
        <div className="space-y-4">
          <Select label="Payload" value={maintenanceForm.payload} onChange={e => setMaintenanceForm({ ...maintenanceForm, payload: e.target.value })} options={[
            { value: '', label: 'Select Payload' },
            ...payloadPlannerData.map(p => ({ value: p.name, label: p.name }))
          ]} />
          <Select label="Maintenance Type" value={maintenanceForm.type} onChange={e => setMaintenanceForm({ ...maintenanceForm, type: e.target.value })} options={[
            { value: 'Routine', label: 'Routine Inspection' },
            { value: 'Calibration', label: 'Sensor Calibration' },
            { value: 'Software', label: 'Software Update' },
            { value: 'Repair', label: 'Emergency Repair' }
          ]} />
          <Select label="Priority" value={maintenanceForm.priority} onChange={e => setMaintenanceForm({ ...maintenanceForm, priority: e.target.value })} options={[
            { value: 'Low', label: 'Low' },
            { value: 'Medium', label: 'Medium' },
            { value: 'High', label: 'High' },
            { value: 'Critical', label: 'Critical' }
          ]} />
          <TextArea label="Reason" value={maintenanceForm.reason} onChange={e => setMaintenanceForm({ ...maintenanceForm, reason: e.target.value })} placeholder="Describe the maintenance requirement..." />
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="ghost" onClick={() => setShowMaintenanceModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => {
              if (!maintenanceForm.payload || !maintenanceForm.reason) return addToast('Please fill all required fields', 'error');
              const p = payloadPlannerData.find(x => x.name === maintenanceForm.payload);
              if (p) setPayloadStatuses(prev => ({ ...prev, [p.id]: 'Maintenance' }));
              addToast(`Maintenance requested for ${maintenanceForm.payload}`, 'success');
              setShowMaintenanceModal(false);
            }}>Submit Request</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PayloadPlanner;