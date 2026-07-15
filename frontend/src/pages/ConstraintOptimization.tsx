import { useState, useMemo } from 'react';
import { FiZap, FiTarget, FiAlertTriangle, FiCheckCircle, FiRefreshCw, FiSliders, FiClock } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Badge, Button, ProgressBar, Card, Spinner } from '../components/common/index';
import { missions } from '../data/mockData';
import { batteryForecast, resourceUsageHeatmap } from '../data/extendedMockData';

interface ConstraintConfig {
  battery: number;
  power: number;
  storage: number;
  memory: number;
  communication: number;
  payload: number;
  priorityWeight: number;
}

const ConstraintOptimization = () => {
  const [constraints, setConstraints] = useState<ConstraintConfig>({
    battery: 20, power: 1000, storage: 4000, memory: 4000, communication: 10, payload: 4, priorityWeight: 0.5,
  });
  const [optimizing, setOptimizing] = useState(false);
  const [optimized, setOptimized] = useState(false);
  const [lastUpdated] = useState(new Date().toLocaleTimeString());

  const updateConstraint = (key: keyof ConstraintConfig, value: number) => {
    setConstraints(prev => ({ ...prev, [key]: value }));
    setOptimized(false);
  };

  const runOptimization = () => {
    setOptimizing(true);
    setTimeout(() => { setOptimizing(false); setOptimized(true); }, 2000);
  };

  const optimizationScore = useMemo(() => {
    if (!optimized) return 0;
    let score = 100;
    if (constraints.battery < 15) score -= 20;
    else if (constraints.battery < 30) score -= 5;
    if (constraints.power > 1500) score -= 10;
    if (constraints.storage > 8000) score -= 8;
    if (constraints.memory > 6000) score -= 8;
    if (constraints.communication > 30) score -= 5;
    if (constraints.payload > 8) score -= 5;
    score += Math.floor(constraints.priorityWeight * 10);
    return Math.max(0, Math.min(100, score + Math.floor(Math.random() * 5)));
  }, [optimized, constraints]);

  const violations = useMemo(() => {
    if (!optimized) return [];
    const v: Array<{ message: string; severity: 'Critical' | 'Warning' | 'Info' }> = [];
    if (constraints.battery < 15) v.push({ message: `Battery threshold ${constraints.battery}% is dangerously low. Risk of satellite shutdown.`, severity: 'Critical' });
    if (constraints.power > 1500) v.push({ message: `Power budget ${constraints.power}W exceeds recommended safe limit of 1500W.`, severity: 'Warning' });
    if (constraints.storage > 7000) v.push({ message: `Storage limit ${constraints.storage}MB may exceed onboard capacity for LEO satellites.`, severity: 'Warning' });
    if (constraints.memory > 6000) v.push({ message: `Memory limit ${constraints.memory}MB exceeds available RAM on 3 satellites.`, severity: 'Warning' });
    if (constraints.communication > 25) v.push({ message: `${constraints.communication} communication windows exceed ground station capacity.`, severity: 'Info' });
    if (v.length === 0) v.push({ message: 'All constraints within nominal parameters. No violations detected.', severity: 'Info' });
    return v;
  }, [optimized, constraints]);

  const suggestedSchedule = useMemo(() => {
    if (!optimized) return [];
    return missions.slice(0, 12).map((m, i) => ({
      ...m,
      optimizedOrder: i + 1,
      conflictFree: i < 9,
    }));
  }, [optimized]);

  const optimizationHistory = [
    { id: 1, timestamp: '2026-07-13 15:30', score: 87, violations: 1 },
    { id: 2, timestamp: '2026-07-13 10:15', score: 72, violations: 3 },
    { id: 3, timestamp: '2026-07-12 22:00', score: 91, violations: 0 },
    { id: 4, timestamp: '2026-07-12 14:45', score: 68, violations: 4 },
    { id: 5, timestamp: '2026-07-11 09:20', score: 84, violations: 2 },
  ];

  const powerUsageData = Array.from({ length: 24 }, (_, i) => ({
    time: `${String(i).padStart(2, '0')}:00`,
    used: 400 + Math.random() * (constraints.power * 0.4),
    budget: constraints.power,
  }));

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const heatmap: Record<string, Record<number, number>> = {};
  resourceUsageHeatmap.forEach(d => {
    if (!heatmap[d.day]) heatmap[d.day] = {};
    heatmap[d.day][parseInt(d.hour)] = d.value;
  });

  const sliderRow = (label: string, key: keyof ConstraintConfig, min: number, max: number, unit: string, step = 1) => (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 dark:border-white/10 print:border-slate-300 bg-slate-50 dark:bg-slate-950/60 print:bg-white px-4 py-3">
      <p className="w-40 text-sm text-slate-600 dark:text-slate-300 print:text-slate-800">{label}</p>
      <input type="range" min={min} max={max} step={step} value={constraints[key]} onChange={e => updateConstraint(key, parseFloat(e.target.value))} className="flex-1 accent-sky-500" />
      <span className="w-20 text-right text-sm font-medium text-slate-900 dark:text-white print:text-black">{constraints[key]}{unit}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500">Dashboard &gt; Constraint Optimization</p>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white print:text-black">Constraint Optimization</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400 print:text-slate-700">Configure parameters and optimize mission schedules</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500">Updated {lastUpdated}</span>
          <Button variant="secondary" size="sm" icon={<FiRefreshCw />} onClick={() => window.location.reload()}>Refresh</Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 dark:border-white/10 print:border-slate-300 bg-white dark:bg-white/10 print:bg-white p-5 shadow-sm dark:shadow-glow print:shadow-none backdrop-blur-xl">
          <p className="text-sm text-slate-500 dark:text-slate-400 print:text-slate-700">Optimization Score</p>
          <p className={`mt-4 text-3xl font-semibold ${optimized ? (optimizationScore > 80 ? 'text-emerald-400' : optimizationScore > 60 ? 'text-amber-400' : 'text-red-400') : 'text-slate-500'}`}>{optimized ? optimizationScore : '—'}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 dark:border-white/10 print:border-slate-300 bg-white dark:bg-white/10 print:bg-white p-5 shadow-sm dark:shadow-glow print:shadow-none backdrop-blur-xl">
          <p className="text-sm text-slate-500 dark:text-slate-400 print:text-slate-700">Conflicts</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white print:text-black">{optimized ? violations.filter(v => v.severity !== 'Info').length : '—'}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 dark:border-white/10 print:border-slate-300 bg-white dark:bg-white/10 print:bg-white p-5 shadow-sm dark:shadow-glow print:shadow-none backdrop-blur-xl">
          <p className="text-sm text-slate-500 dark:text-slate-400 print:text-slate-700">Resolved</p>
          <p className="mt-4 text-3xl font-semibold text-emerald-400">{optimized ? suggestedSchedule.filter(s => s.conflictFree).length : '—'}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 dark:border-white/10 print:border-slate-300 bg-white dark:bg-white/10 print:bg-white p-5 shadow-sm dark:shadow-glow print:shadow-none backdrop-blur-xl">
          <p className="text-sm text-slate-500 dark:text-slate-400 print:text-slate-700">Remaining</p>
          <p className="mt-4 text-3xl font-semibold text-amber-400">{optimized ? suggestedSchedule.filter(s => !s.conflictFree).length : '—'}</p>
        </div>
      </div>

      {/* Input + Output */}
      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        {/* Constraint Input Panel */}
        <div className="rounded-3xl border border-slate-200 dark:border-white/10 print:border-slate-300 bg-white dark:bg-white/10 print:bg-white p-5 shadow-sm dark:shadow-glow print:shadow-none backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-4">
            <FiSliders className="text-sky-400" />
            <p className="text-lg font-semibold text-slate-900 dark:text-white print:text-black">Resource Constraints</p>
          </div>
          <div className="space-y-3">
            {sliderRow('Battery Threshold', 'battery', 0, 100, '%')}
            {sliderRow('Power Budget', 'power', 0, 2000, 'W', 50)}
            {sliderRow('Storage Limit', 'storage', 0, 10000, 'MB', 100)}
            {sliderRow('Memory Limit', 'memory', 0, 8000, 'MB', 100)}
            {sliderRow('Comm Limit', 'communication', 0, 50, '', 1)}
            {sliderRow('Payload Capacity', 'payload', 0, 10, '', 1)}
            {sliderRow('Priority Weight', 'priorityWeight', 0, 1, '', 0.1)}
          </div>
          <div className="mt-4">
            <Button variant="primary" size="lg" icon={optimizing ? undefined : <FiZap />} isLoading={optimizing} onClick={runOptimization} className="w-full">
              {optimizing ? 'Running Optimization...' : 'Run Optimization'}
            </Button>
          </div>
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          {/* Violations */}
          <div className="rounded-3xl border border-slate-200 dark:border-white/10 print:border-slate-300 bg-white dark:bg-white/10 print:bg-white p-5 shadow-sm dark:shadow-glow print:shadow-none backdrop-blur-xl">
            <p className="mb-4 text-lg font-semibold text-slate-900 dark:text-white print:text-black">Constraint Violations</p>
            {!optimized ? (
              <p className="text-sm text-slate-500 dark:text-slate-400 print:text-slate-700">Run optimization to see results.</p>
            ) : (
              <div className="space-y-3">
                {violations.map((v, i) => (
                  <div key={i} className={`rounded-2xl border p-3 ${v.severity === 'Critical' ? 'border-red-500/30 bg-red-500/10' : v.severity === 'Warning' ? 'border-amber-500/30 bg-amber-500/10' : 'border-sky-500/30 bg-sky-500/10'}`}>
                    <div className="flex items-center gap-2">
                      {v.severity === 'Critical' ? <FiAlertTriangle className="text-red-400" /> : v.severity === 'Warning' ? <FiAlertTriangle className="text-amber-400" /> : <FiCheckCircle className="text-sky-400" />}
                      <Badge variant={v.severity === 'Critical' ? 'danger' : v.severity === 'Warning' ? 'warning' : 'info'}>{v.severity}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 print:text-slate-800">{v.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Score Gauge */}
          {optimized && (
            <div className="rounded-3xl border border-slate-200 dark:border-white/10 print:border-slate-300 bg-white dark:bg-white/10 print:bg-white p-5 shadow-sm dark:shadow-glow print:shadow-none backdrop-blur-xl text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400 print:text-slate-700">Optimization Score</p>
              <div className={`mt-4 mx-auto flex h-28 w-28 items-center justify-center rounded-full border-4 ${optimizationScore > 80 ? 'border-emerald-500 text-emerald-400' : optimizationScore > 60 ? 'border-amber-500 text-amber-400' : 'border-red-500 text-red-400'}`}>
                <span className="text-3xl font-bold">{optimizationScore}</span>
              </div>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 print:text-slate-700">{optimizationScore > 80 ? 'Excellent' : optimizationScore > 60 ? 'Good' : 'Needs Improvement'}</p>
            </div>
          )}
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 dark:border-white/10 print:border-slate-300 bg-white dark:bg-white/10 print:bg-white p-5 shadow-sm dark:shadow-glow print:shadow-none backdrop-blur-xl">
          <p className="mb-4 text-lg font-semibold text-slate-900 dark:text-white print:text-black">Power Usage vs Budget</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={powerUsageData}>
                <CartesianGrid stroke="rgba(148,163,184,0.16)" strokeDasharray="4 4" />
                <XAxis dataKey="time" stroke="currentColor" className="text-slate-500 dark:text-slate-400 print:text-black" tick={{ fontSize: 9 }} />
                <YAxis stroke="currentColor" className="text-slate-500 dark:text-slate-400 print:text-black" />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff' }} />
                <Area type="monotone" dataKey="used" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} name="Used" />
                <Area type="monotone" dataKey="budget" stroke="#ef4444" fill="none" strokeDasharray="6 3" name="Budget" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 dark:border-white/10 print:border-slate-300 bg-white dark:bg-white/10 print:bg-white p-5 shadow-sm dark:shadow-glow print:shadow-none backdrop-blur-xl">
          <p className="mb-4 text-lg font-semibold text-slate-900 dark:text-white print:text-black">Battery Forecast</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={batteryForecast.slice(0, 24)}>
                <CartesianGrid stroke="rgba(148,163,184,0.16)" strokeDasharray="4 4" />
                <XAxis dataKey="time" stroke="currentColor" className="text-slate-500 dark:text-slate-400 print:text-black" tick={{ fontSize: 9 }} />
                <YAxis stroke="currentColor" className="text-slate-500 dark:text-slate-400 print:text-black" />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff' }} />
                <Area type="monotone" dataKey="predicted" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.15} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Conflict Heatmap */}
      <div className="rounded-3xl border border-slate-200 dark:border-white/10 print:border-slate-300 bg-white dark:bg-white/10 print:bg-white p-5 shadow-sm dark:shadow-glow print:shadow-none backdrop-blur-xl">
        <p className="mb-4 text-lg font-semibold text-slate-900 dark:text-white print:text-black">Conflict Heatmap</p>
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            <div className="flex text-[9px] text-slate-500 pl-10 mb-1">
              {hours.map(h => <div key={h} className="flex-1 text-center">{h}</div>)}
            </div>
            {days.map(day => (
              <div key={day} className="flex items-center">
                <div className="w-10 text-xs text-slate-500 dark:text-slate-400 print:text-slate-700">{day}</div>
                <div className="flex flex-1 gap-[1px]">
                  {hours.map(h => {
                    const val = heatmap[day]?.[h] || 0;
                    return <div key={h} className="flex-1 h-5 rounded-sm" style={{ backgroundColor: `rgba(239, 68, 68, ${Math.max(0.05, val / 100)})` }} title={`${day} ${h}:00 — ${val}%`} />;
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Suggested Schedule */}
      {optimized && (
        <div className="rounded-3xl border border-slate-200 dark:border-white/10 print:border-slate-300 bg-white dark:bg-white/10 print:bg-white p-5 shadow-sm dark:shadow-glow print:shadow-none backdrop-blur-xl">
          <p className="mb-4 text-lg font-semibold text-slate-900 dark:text-white print:text-black">Suggested Schedule</p>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-200 dark:border-white/10 print:border-slate-300 bg-white dark:bg-white/5">
                <tr>
                  {['#', 'Mission', 'Satellite', 'Priority', 'Duration', 'Conflict Status'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 print:text-slate-700">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/5 print:divide-slate-300">
                {suggestedSchedule.map(m => (
                  <tr key={m.id} className="transition hover:bg-white dark:bg-white/5">
                    <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400 print:text-slate-700">{m.optimizedOrder}</td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white print:text-black">{m.name}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300 print:text-slate-800">{m.satellite}</td>
                    <td className="px-4 py-3"><Badge variant={m.priority === 'Critical' ? 'danger' : m.priority === 'High' ? 'warning' : m.priority === 'Medium' ? 'info' : 'default'}>{m.priority}</Badge></td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300 print:text-slate-800">{m.estimatedDuration} min</td>
                    <td className="px-4 py-3"><Badge variant={m.conflictFree ? 'success' : 'danger'}>{m.conflictFree ? 'Clear' : 'Conflict'}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Optimization History */}
      <div className="rounded-3xl border border-slate-200 dark:border-white/10 print:border-slate-300 bg-white dark:bg-white/10 print:bg-white p-5 shadow-sm dark:shadow-glow print:shadow-none backdrop-blur-xl">
        <p className="mb-4 text-lg font-semibold text-slate-900 dark:text-white print:text-black">Optimization History</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {optimizationHistory.map(h => (
            <div key={h.id} className="rounded-2xl border border-slate-200 dark:border-white/10 print:border-slate-300 bg-slate-50 dark:bg-slate-950/60 print:bg-white p-3 text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400 print:text-slate-700">{h.timestamp}</p>
              <p className={`mt-2 text-2xl font-bold ${h.score > 80 ? 'text-emerald-400' : h.score > 60 ? 'text-amber-400' : 'text-red-400'}`}>{h.score}</p>
              <p className="mt-1 text-xs text-slate-500">{h.violations} violation{h.violations !== 1 ? 's' : ''}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConstraintOptimization;