import { useState, useMemo } from 'react';
import { FiBatteryCharging, FiHardDrive, FiServer, FiZap, FiRefreshCw, FiSearch, FiTrendingUp, FiTrendingDown, FiMinus, FiCpu, FiSun } from 'react-icons/fi';
import { AreaChart, Area, LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import ResourceChart from '../components/ResourceCharts/ResourceChart';
import BatteryIndicator from '../components/BatteryStatus/BatteryIndicator';
import { Badge, Button, ProgressBar, Card } from '../components/common/index';
import { resourceData } from '../data/dummyData';
import { batteryForecast, powerForecast, memoryForecast, bandwidthForecast, storageForecast, subsystemHealth, resourceUtilization } from '../data/extendedMockData';

const Resources = () => {
  const [resSearch, setResSearch] = useState('');
  const [resSortKey, setResSortKey] = useState('satellite');
  const [resSortDir, setResSortDir] = useState<'asc' | 'desc'>('asc');
  const [lastUpdated] = useState(new Date().toLocaleTimeString());

  const filteredResources = useMemo(() => {
    let data = resourceUtilization.filter(r =>
      r.satellite.toLowerCase().includes(resSearch.toLowerCase())
    );
    data.sort((a, b) => {
      const aVal = (a as any)[resSortKey];
      const bVal = (b as any)[resSortKey];
      if (aVal < bVal) return resSortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return resSortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return data;
  }, [resSearch, resSortKey, resSortDir]);

  const toggleResSort = (key: string) => {
    if (resSortKey === key) setResSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setResSortKey(key); setResSortDir('asc'); }
  };

  const criticalCount = resourceUtilization.filter(r => r.risk === 'Critical').length;
  const highCount = resourceUtilization.filter(r => r.risk === 'High').length;
  const riskLevel = criticalCount > 0 ? 'Critical' : highCount > 2 ? 'High' : highCount > 0 ? 'Medium' : 'Low';

  const valueColor = (val: number, invert = false) => {
    if (invert) return val > 70 ? 'text-red-400' : val > 40 ? 'text-amber-400' : 'text-emerald-400';
    return val > 70 ? 'text-emerald-400' : val > 40 ? 'text-amber-400' : 'text-red-400';
  };

  const forecastCharts = [
    { title: 'Battery Forecast', data: batteryForecast, color: '#38bdf8' },
    { title: 'Power Forecast', data: powerForecast, color: '#8b5cf6' },
    { title: 'Memory Forecast', data: memoryForecast, color: '#f59e0b' },
    { title: 'Bandwidth Forecast', data: bandwidthForecast, color: '#10b981' },
    { title: 'Storage Forecast', data: storageForecast, color: '#ef4444' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500">Dashboard &gt; Resource Management</p>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white print:text-black">Resource Management</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400 print:text-slate-700">Monitor and forecast resource utilization across the fleet</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500">Updated {lastUpdated}</span>
          <Button variant="secondary" size="sm" icon={<FiRefreshCw />} onClick={() => window.location.reload()}>Refresh</Button>
        </div>
      </div>

      {/* Existing Stat Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Battery', value: '78%', icon: FiBatteryCharging },
          { label: 'Power', value: '62%', icon: FiZap },
          { label: 'Memory', value: '69%', icon: FiServer },
          { label: 'Storage', value: '74%', icon: FiHardDrive },
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

      {/* Existing Battery + Prediction */}
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <BatteryIndicator percentage={78} />
        <div className="rounded-3xl border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-800 print:bg-white p-5 shadow-sm dark:shadow-glow print:shadow-none backdrop-blur-xl">
          <p className="mb-4 text-lg font-semibold text-slate-900 dark:text-white print:text-black">Prediction Snapshot</p>
          <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300 print:text-slate-800">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-slate-50 dark:bg-slate-800/80 print:bg-white p-3">
              <p className="font-medium text-slate-900 dark:text-white print:text-black">Projected battery reserve</p>
              <p className="mt-2">Expected to drop by 6% over the next 4 hours under current load.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-slate-50 dark:bg-slate-800/80 print:bg-white p-3">
              <p className="font-medium text-slate-900 dark:text-white print:text-black">Storage pressure</p>
              <p className="mt-2">A 5% gain in image acquisition volume is expected before midnight.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Existing Resource Chart */}
      <ResourceChart data={resourceData} />

      {/* Resource Forecasts */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-800 print:bg-white p-5 shadow-sm dark:shadow-glow print:shadow-none backdrop-blur-xl">
        <p className="mb-4 text-lg font-semibold text-slate-900 dark:text-white print:text-black">Resource Forecasts (48h)</p>
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {forecastCharts.map(fc => (
            <div key={fc.title} className="rounded-2xl border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-slate-50 dark:bg-slate-800/80 print:bg-white p-4">
              <p className="mb-2 text-sm font-medium text-slate-900 dark:text-white print:text-black">{fc.title}</p>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={fc.data}>
                    <CartesianGrid stroke="rgba(148,163,184,0.1)" strokeDasharray="4 4" />
                    <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 8 }} interval={5} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 9 }} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff' }} />
                    <Area type="monotone" dataKey="upperBound" stroke="none" fill={fc.color} fillOpacity={0.08} />
                    <Area type="monotone" dataKey="lowerBound" stroke="none" fill={fc.color} fillOpacity={0.08} />
                    <Line type="monotone" dataKey="predicted" stroke={fc.color} strokeWidth={2} strokeDasharray="6 3" dot={false} />
                    <Line type="monotone" dataKey="actual" stroke={fc.color} strokeWidth={2} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Indicator + Subsystem Health */}
      <div className="grid gap-6 xl:grid-cols-[0.4fr_1fr]">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-800 print:bg-white p-5 shadow-sm dark:shadow-glow print:shadow-none backdrop-blur-xl flex flex-col items-center justify-center">
          <p className="text-sm text-slate-600 dark:text-slate-400 print:text-slate-700">Overall Risk Level</p>
          <div className={`mt-4 flex h-24 w-24 items-center justify-center rounded-full ${riskLevel === 'Critical' ? 'bg-red-500/20 text-red-400' : riskLevel === 'High' ? 'bg-amber-500/20 text-amber-400' : riskLevel === 'Medium' ? 'bg-sky-500/20 text-sky-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
            <span className="text-2xl font-bold">{riskLevel}</span>
          </div>
          <p className="mt-3 text-xs text-slate-600 dark:text-slate-400 print:text-slate-700">{criticalCount} critical, {highCount} high risk satellites</p>
        </div>
        <div className="rounded-3xl border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-800 print:bg-white p-5 shadow-sm dark:shadow-glow print:shadow-none backdrop-blur-xl">
          <p className="mb-4 text-lg font-semibold text-slate-900 dark:text-white print:text-black">Subsystem Health</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {subsystemHealth.map(s => (
              <div key={s.name} className="rounded-2xl border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-slate-50 dark:bg-slate-800/80 print:bg-white p-3 text-center">
                <p className="text-xs text-slate-600 dark:text-slate-400 print:text-slate-700">{s.name}</p>
                <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white print:text-black">{s.value}<span className="text-sm text-slate-600 dark:text-slate-400 print:text-slate-700">{s.unit}</span></p>
                <div className="mt-2 flex items-center justify-center gap-2">
                  <Badge variant={s.status === 'Nominal' ? 'success' : s.status === 'Warning' ? 'warning' : 'danger'}>{s.status}</Badge>
                  {s.trend === 'up' ? <FiTrendingUp className="text-emerald-400 text-xs" /> : s.trend === 'down' ? <FiTrendingDown className="text-red-400 text-xs" /> : <FiMinus className="text-slate-600 dark:text-slate-400 print:text-slate-700 text-xs" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Resource Utilization Table */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-800 print:bg-white p-5 shadow-sm dark:shadow-glow print:shadow-none backdrop-blur-xl">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-lg font-semibold text-slate-900 dark:text-white print:text-black">Resource Utilization by Satellite</p>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 dark:text-slate-400 print:text-slate-700" />
            <input type="text" placeholder="Search..." value={resSearch} onChange={e => setResSearch(e.target.value)} className="rounded-lg border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-800 py-1.5 pl-9 pr-4 text-sm text-slate-900 dark:text-white print:text-black placeholder-slate-400 dark:placeholder-slate-500 focus:border-sky-500 focus:outline-none" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-800">
              <tr>
                {[
                  { key: 'satellite', label: 'Satellite' },
                  { key: 'battery', label: 'Battery %' },
                  { key: 'memory', label: 'Memory %' },
                  { key: 'storage', label: 'Storage %' },
                  { key: 'power', label: 'Power %' },
                  { key: 'bandwidth', label: 'Bandwidth %' },
                  { key: 'cpu', label: 'CPU %' },
                  { key: 'risk', label: 'Risk' },
                ].map(col => (
                  <th key={col.key} className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 print:text-slate-700 cursor-pointer hover:text-slate-900 dark:text-white print:text-black transition" onClick={() => toggleResSort(col.key)}>
                    {col.label} {resSortKey === col.key ? (resSortDir === 'asc' ? '↑' : '↓') : ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5 print:divide-slate-300">
              {filteredResources.map(r => (
                <tr key={r.satellite} className="transition hover:bg-white dark:bg-slate-800">
                  <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white print:text-black">{r.satellite}</td>
                  <td className={`px-4 py-3 text-sm font-medium ${valueColor(r.battery)}`}>{r.battery}%</td>
                  <td className={`px-4 py-3 text-sm font-medium ${valueColor(r.memory, true)}`}>{r.memory}%</td>
                  <td className={`px-4 py-3 text-sm font-medium ${valueColor(r.storage, true)}`}>{r.storage}%</td>
                  <td className={`px-4 py-3 text-sm font-medium ${valueColor(r.power, true)}`}>{r.power}%</td>
                  <td className={`px-4 py-3 text-sm font-medium ${valueColor(r.bandwidth, true)}`}>{r.bandwidth}%</td>
                  <td className={`px-4 py-3 text-sm font-medium ${valueColor(r.cpu, true)}`}>{r.cpu}%</td>
                  <td className="px-4 py-3"><Badge variant={r.risk === 'Critical' ? 'danger' : r.risk === 'High' ? 'warning' : r.risk === 'Medium' ? 'info' : 'success'}>{r.risk}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Prediction Explanation */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-800 print:bg-white p-5 shadow-sm dark:shadow-glow print:shadow-none backdrop-blur-xl">
        <p className="mb-4 text-lg font-semibold text-slate-900 dark:text-white print:text-black">AI Prediction Explanation</p>
        <div className="space-y-4">
          {[
            { title: 'Battery drain rate accelerating', confidence: 94, text: 'Based on current payload operations and eclipse cycle timing, fleet average battery will decline by 8% over the next 6 hours. Recommend reducing non-critical payload operations on SatelliteEight and SatelliteFour.' },
            { title: 'Memory pressure on LEO constellation', confidence: 88, text: 'Data collection rates exceed downlink capacity for SatelliteFive and SatelliteTen. At current rates, onboard storage will reach 90% within 4 orbits. Suggest enabling data compression or scheduling additional downlink windows.' },
            { title: 'Power optimization opportunity', confidence: 91, text: 'Redistributing workload from SatelliteOne (85% power utilization) to SatelliteTwo (45% power utilization) could save 120W across the constellation and extend operational margins.' },
          ].map(p => (
            <div key={p.title} className="rounded-2xl border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-slate-50 dark:bg-slate-800/80 print:bg-white p-4">
              <div className="flex items-center justify-between">
                <p className="font-medium text-slate-900 dark:text-white print:text-black">{p.title}</p>
                <span className="text-xs text-sky-400">Confidence: {p.confidence}%</span>
              </div>
              <ProgressBar value={p.confidence} showLabel={false} className="mt-2" />
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 print:text-slate-700">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Resources;
