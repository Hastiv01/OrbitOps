import { useState, useMemo } from 'react';
import { FiGlobe, FiRadio, FiWifi, FiClock, FiRefreshCw, FiSearch, FiChevronRight } from 'react-icons/fi';
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import CommunicationWindowCard from '../components/CommunicationWindow/CommunicationWindowCard';
import PayloadCard from '../components/PayloadCard/PayloadCard';
import { Badge, Button, ProgressBar, Card } from '../components/common/index';
import { communicationWindows, groundStations, payloads } from '../data/dummyData';
import { satellites } from '../data/mockData';
import { satelliteHealthSummaries, generateTelemetryData, signalStrengthData, communicationQueue } from '../data/extendedMockData';

const SatelliteOperations = () => {
  const [satSearch, setSatSearch] = useState('');
  const [selectedSatellite, setSelectedSatellite] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<string>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [queueSearch, setQueueSearch] = useState('');
  const [lastUpdated] = useState(new Date().toLocaleTimeString());

  const filteredSatellites = useMemo(() => {
    let sats = satellites.filter(s =>
      s.name.toLowerCase().includes(satSearch.toLowerCase()) ||
      s.orbit.toLowerCase().includes(satSearch.toLowerCase())
    );
    sats.sort((a, b) => {
      const aVal = (a as any)[sortKey];
      const bVal = (b as any)[sortKey];
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return sats;
  }, [satellites, satSearch, sortKey, sortDir]);

  const selectedSatData = selectedSatellite ? satelliteHealthSummaries.find(s => s.id === selectedSatellite) : null;
  const selectedSatInfo = selectedSatellite ? satellites.find(s => s.id === selectedSatellite) : null;
  const telemetryData = selectedSatellite ? generateTelemetryData(selectedSatInfo?.name || '') : [];

  const toggleSort = (key: string) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const filteredQueue = communicationQueue.filter(q =>
    q.satellite.toLowerCase().includes(queueSearch.toLowerCase()) ||
    q.station.toLowerCase().includes(queueSearch.toLowerCase())
  );

  const commPerStation = useMemo(() => {
    const counts: Record<string, number> = {};
    communicationQueue.forEach(q => { counts[q.station] = (counts[q.station] || 0) + 1; });
    return Object.entries(counts).map(([name, count]) => ({ name: name.length > 12 ? name.substring(0, 10) + '...' : name, windows: count }));
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500">Dashboard &gt; Satellite Operations</p>
          <h1 className="text-3xl font-bold text-white">Satellite Operations</h1>
          <p className="mt-1 text-slate-400">Monitor and manage satellite fleet</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500">Updated {lastUpdated}</span>
          <Button variant="secondary" size="sm" icon={<FiRefreshCw />} onClick={() => window.location.reload()}>Refresh</Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Total Satellites', value: String(satellites.length), icon: FiRadio },
          { label: 'Active', value: String(satellites.filter(s => s.status === 'Active').length), icon: FiWifi },
          { label: 'Ground Stations', value: '5', icon: FiGlobe },
          { label: 'Orbit Coverage', value: '94%', icon: FiGlobe },
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

      {/* Satellite List Table */}
      <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-glow backdrop-blur-xl">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-lg font-semibold text-white">Satellite Fleet</p>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search satellites..." value={satSearch} onChange={e => setSatSearch(e.target.value)} className="rounded-lg border border-white/10 bg-white/5 py-1.5 pl-9 pr-4 text-sm text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-white/10 bg-white/5">
              <tr>
                {[
                  { key: 'name', label: 'Name' },
                  { key: 'status', label: 'Status' },
                  { key: 'orbit', label: 'Orbit' },
                  { key: 'altitude', label: 'Altitude (km)' },
                  { key: 'inclination', label: 'Incl (°)' },
                  { key: 'batteryHealth', label: 'Battery' },
                  { key: 'temperature', label: 'Temp (°C)' },
                ].map(col => (
                  <th key={col.key} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 cursor-pointer hover:text-white transition" onClick={() => toggleSort(col.key)}>
                    {col.label} {sortKey === col.key ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                  </th>
                ))}
                <th className="px-4 py-3 text-xs font-semibold text-slate-400" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredSatellites.map(sat => (
                <tr key={sat.id} className={`transition hover:bg-white/5 cursor-pointer ${selectedSatellite === sat.id ? 'bg-sky-500/10' : ''}`} onClick={() => setSelectedSatellite(sat.id === selectedSatellite ? null : sat.id)}>
                  <td className="px-4 py-3 text-sm font-medium text-white">{sat.name}</td>
                  <td className="px-4 py-3"><Badge variant={sat.status === 'Active' ? 'success' : sat.status === 'Maintenance' ? 'warning' : 'danger'}>{sat.status}</Badge></td>
                  <td className="px-4 py-3 text-sm text-slate-300">{sat.orbit}</td>
                  <td className="px-4 py-3 text-sm text-slate-300">{sat.altitude.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-slate-300">{sat.inclination}°</td>
                  <td className="px-4 py-3 w-32"><ProgressBar value={sat.batteryHealth} showLabel={true} /></td>
                  <td className="px-4 py-3 text-sm text-slate-300">{sat.temperature}°C</td>
                  <td className="px-4 py-3"><FiChevronRight className={`text-slate-400 transition ${selectedSatellite === sat.id ? 'rotate-90' : ''}`} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Satellite Details Panel */}
      {selectedSatData && selectedSatInfo && (
        <div className="rounded-3xl border border-sky-500/30 bg-white/10 p-5 shadow-glow backdrop-blur-xl">
          <p className="mb-4 text-lg font-semibold text-white">{selectedSatInfo.name} — Details</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
              <p className="text-xs text-slate-400">Orbit Type</p>
              <p className="mt-1 text-lg font-semibold text-white">{selectedSatInfo.orbit}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
              <p className="text-xs text-slate-400">Altitude</p>
              <p className="mt-1 text-lg font-semibold text-white">{selectedSatInfo.altitude.toLocaleString()} km</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
              <p className="text-xs text-slate-400">Velocity</p>
              <p className="mt-1 text-lg font-semibold text-white">{selectedSatData.velocity.toFixed(2)} km/s</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
              <p className="text-xs text-slate-400">Coverage Area</p>
              <p className="mt-1 text-lg font-semibold text-white">{selectedSatData.coverageArea.toLocaleString()} km²</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
              <p className="text-xs text-slate-400">Comm Status</p>
              <Badge variant={selectedSatData.commStatus === 'Online' ? 'success' : selectedSatData.commStatus === 'Intermittent' ? 'warning' : 'danger'}>{selectedSatData.commStatus}</Badge>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
              <p className="text-xs text-slate-400">Last Contact</p>
              <p className="mt-1 text-sm text-white">{new Date(selectedSatData.lastContact).toLocaleTimeString()}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
              <p className="text-xs text-slate-400">Next Contact</p>
              <p className="mt-1 text-sm text-white">{new Date(selectedSatData.nextContact).toLocaleTimeString()}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
              <p className="text-xs text-slate-400">Orbit Status</p>
              <Badge variant={selectedSatData.orbitStatus === 'Stable' ? 'success' : 'warning'}>{selectedSatData.orbitStatus}</Badge>
            </div>
          </div>
          {/* Telemetry Charts */}
          <p className="mt-6 mb-3 text-sm font-semibold text-white">Telemetry (24h)</p>
          <div className="grid gap-4 lg:grid-cols-3">
            {[
              { key: 'battery', label: 'Battery %', color: '#38bdf8' },
              { key: 'temperature', label: 'Temperature °C', color: '#f59e0b' },
              { key: 'cpuUsage', label: 'CPU Usage %', color: '#8b5cf6' },
            ].map(ch => (
              <div key={ch.key} className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
                <p className="mb-2 text-xs text-slate-400">{ch.label}</p>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={telemetryData}>
                      <CartesianGrid stroke="rgba(148,163,184,0.1)" strokeDasharray="4 4" />
                      <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 9 }} />
                      <YAxis stroke="#64748b" tick={{ fontSize: 9 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey={ch.key} stroke={ch.color} strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Signal Strength Chart */}
      <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-glow backdrop-blur-xl">
        <p className="mb-4 text-lg font-semibold text-white">Signal Strength (24h)</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={signalStrengthData}>
              <CartesianGrid stroke="rgba(148,163,184,0.16)" strokeDasharray="4 4" />
              <XAxis dataKey="time" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Line type="monotone" dataKey="Kennedy SC" stroke="#38bdf8" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="ESA Paris" stroke="#8b5cf6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Baikonur" stroke="#f59e0b" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="ISRC India" stroke="#10b981" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Guam GS" stroke="#ef4444" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Communication Windows + Ground Stations (existing) */}
      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-glow backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-lg font-semibold text-white">Communication Windows</p>
            <span className="text-sm text-slate-400">Today</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {communicationWindows.map(window => (
              <CommunicationWindowCard key={window.id} window={window} />
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-glow backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-lg font-semibold text-white">Ground Stations</p>
            <span className="text-sm text-slate-400">Operational</span>
          </div>
          <div className="space-y-3">
            {groundStations.map(station => (
              <div key={station.id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-white">{station.name}</p>
                  <span className="text-xs text-slate-400">{station.availability}</span>
                </div>
                <p className="mt-2 text-sm text-slate-400">{station.location}</p>
                <p className="mt-1 text-sm text-slate-400">Latency {station.latency} • {station.capacity} capacity</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Communication Utilization Chart */}
      <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-glow backdrop-blur-xl">
        <p className="mb-4 text-lg font-semibold text-white">Communication Utilization by Station</p>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={commPerStation}>
              <CartesianGrid stroke="rgba(148,163,184,0.16)" strokeDasharray="4 4" />
              <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 10 }} />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Bar dataKey="windows" fill="#38bdf8" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Ground Station Queue */}
      <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-glow backdrop-blur-xl">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-lg font-semibold text-white">Communication Queue</p>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search queue..." value={queueSearch} onChange={e => setQueueSearch(e.target.value)} className="rounded-lg border border-white/10 bg-white/5 py-1.5 pl-9 pr-4 text-sm text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-white/10 bg-white/5">
              <tr>
                {['Satellite', 'Station', 'Time', 'Duration', 'Priority', 'Data', 'Status', 'Type'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredQueue.map(q => (
                <tr key={q.id} className="transition hover:bg-white/5">
                  <td className="px-4 py-3 text-sm text-white">{q.satellite}</td>
                  <td className="px-4 py-3 text-sm text-slate-300">{q.station}</td>
                  <td className="px-4 py-3 text-sm text-slate-300">{new Date(q.scheduledTime).toLocaleTimeString()}</td>
                  <td className="px-4 py-3 text-sm text-slate-300">{q.duration} min</td>
                  <td className="px-4 py-3"><Badge variant={q.priority === 'Critical' ? 'danger' : q.priority === 'High' ? 'warning' : q.priority === 'Medium' ? 'info' : 'default'}>{q.priority}</Badge></td>
                  <td className="px-4 py-3 text-sm text-slate-300">{q.dataSize}</td>
                  <td className="px-4 py-3"><Badge variant={q.status === 'Completed' ? 'success' : q.status === 'In Progress' ? 'info' : q.status === 'Failed' ? 'danger' : 'default'}>{q.status}</Badge></td>
                  <td className="px-4 py-3"><Badge variant={q.type === 'Downlink' ? 'info' : 'default'}>{q.type}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payload Schedule + Visibility (existing) */}
      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-glow backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-lg font-semibold text-white">Payload Schedule</p>
            <span className="text-sm text-slate-400">Next 6 hours</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {payloads.map(payload => (
              <PayloadCard key={payload.id} payload={payload} />
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-glow backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-lg font-semibold text-white">Visibility Timeline</p>
            <div className="rounded-full bg-sky-500/15 p-2 text-sky-300"><FiClock /></div>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Astra-7', time: '08:00 - 08:20' },
              { label: 'Nova-2', time: '11:15 - 11:40' },
              { label: 'Orion-4', time: '15:35 - 16:00' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3">
                <span className="font-medium text-white">{item.label}</span>
                <span className="text-sm text-slate-400">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SatelliteOperations;