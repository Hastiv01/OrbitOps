import { useState, useMemo } from 'react';
import { FiAlertTriangle, FiCpu, FiRadio, FiZap, FiRefreshCw, FiSearch, FiCheck, FiX, FiPlay, FiClock } from 'react-icons/fi';
import { Badge, Button, ProgressBar, Card, Modal } from '../components/common/index';
import RecommendationCard from '../components/RecommendationPanel/RecommendationCard';
import { recommendations } from '../data/dummyData';
import { recommendationDetails, type RecommendationDetail } from '../data/extendedMockData';

const Recommendations = () => {
  const [selectedRec, setSelectedRec] = useState<RecommendationDetail | null>(null);
  const [historySearch, setHistorySearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [recStatuses, setRecStatuses] = useState<Record<string, string>>({});
  const [lastUpdated] = useState(new Date().toLocaleTimeString());

  const getStatus = (rec: RecommendationDetail) => recStatuses[rec.id] || rec.status;

  const filteredHistory = useMemo(() => {
    return recommendationDetails.filter(r => {
      if (historySearch && !r.title.toLowerCase().includes(historySearch.toLowerCase()) && !r.affectedSatellite.toLowerCase().includes(historySearch.toLowerCase())) return false;
      if (statusFilter && getStatus(r) !== statusFilter) return false;
      return true;
    });
  }, [historySearch, statusFilter, recStatuses]);

  const appliedCount = recommendationDetails.filter(r => getStatus(r) === 'Applied').length;
  const dismissedCount = recommendationDetails.filter(r => getStatus(r) === 'Dismissed').length;
  const avgConfidence = Math.round(recommendationDetails.reduce((s, r) => s + r.confidenceScore, 0) / recommendationDetails.length);

  const handleAction = (id: string, action: 'Applied' | 'Dismissed') => {
    setRecStatuses(prev => ({ ...prev, [id]: action }));
    if (selectedRec?.id === id) setSelectedRec(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500">Dashboard &gt; Recommendations</p>
          <h1 className="text-3xl font-bold text-white">AI Recommendations</h1>
          <p className="mt-1 text-slate-400">AI-generated insights and optimization suggestions</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500">Updated {lastUpdated}</span>
          <Button variant="secondary" size="sm" icon={<FiRefreshCw />} onClick={() => window.location.reload()}>Refresh</Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Total Active', value: String(recommendationDetails.filter(r => getStatus(r) === 'New' || getStatus(r) === 'Reviewed').length), icon: FiZap },
          { label: 'Applied', value: String(appliedCount), icon: FiCheck },
          { label: 'Avg Confidence', value: `${avgConfidence}%`, icon: FiCpu },
          { label: 'Warnings', value: String(recommendationDetails.filter(r => r.priority === 'Critical' || r.priority === 'High').length), icon: FiAlertTriangle },
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

      {/* Recommendation Cards + Context (existing layout) */}
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          {recommendations.map(item => (
            <div key={item.id} onClick={() => {
              const detail = recommendationDetails.find(rd => rd.title === item.title);
              if (detail) setSelectedRec(detail);
            }} className="cursor-pointer transition hover:opacity-90">
              <RecommendationCard recommendation={item} />
            </div>
          ))}
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-glow backdrop-blur-xl">
          <p className="text-lg font-semibold text-white">Recommendation Context</p>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
              <p className="font-medium text-white">Risk Level</p>
              <p className="mt-2">Moderate. Priority actions should be executed within the next 90 minutes.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
              <p className="font-medium text-white">Resource warnings</p>
              <p className="mt-2">Battery reserve is trending down, and uplink capacity is nearing saturation.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendation Details Panel */}
      {selectedRec && (
        <div className="rounded-3xl border border-sky-500/30 bg-white/10 p-6 shadow-glow backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-lg font-semibold text-white">{selectedRec.title}</p>
              <p className="text-sm text-slate-400">{selectedRec.description}</p>
            </div>
            <button onClick={() => setSelectedRec(null)} className="rounded-lg bg-white/10 p-2 text-slate-400 hover:bg-white/20 transition"><FiX /></button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
              <p className="text-xs text-slate-400">Why Generated</p>
              <p className="mt-2 text-sm text-slate-300">{selectedRec.whyGenerated}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
              <p className="text-xs text-slate-400">Expected Benefit</p>
              <p className="mt-2 text-sm text-slate-300">{selectedRec.expectedBenefit}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
              <p className="text-xs text-slate-400">Suggested Action</p>
              <p className="mt-2 text-sm text-slate-300">{selectedRec.suggestedAction}</p>
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
              <p className="text-xs text-slate-400">Affected Mission</p>
              <p className="mt-1 text-sm font-medium text-white">{selectedRec.affectedMission}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
              <p className="text-xs text-slate-400">Affected Satellite</p>
              <p className="mt-1 text-sm font-medium text-white">{selectedRec.affectedSatellite}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
              <p className="text-xs text-slate-400">Confidence Score</p>
              <p className="mt-1 text-lg font-bold text-sky-400">{selectedRec.confidenceScore}%</p>
              <ProgressBar value={selectedRec.confidenceScore} showLabel={false} className="mt-1" />
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
              <p className="text-xs text-slate-400">Priority</p>
              <Badge variant={selectedRec.priority === 'Critical' ? 'danger' : selectedRec.priority === 'High' ? 'warning' : selectedRec.priority === 'Medium' ? 'info' : 'default'}>{selectedRec.priority}</Badge>
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
              <p className="text-xs text-slate-400">Estimated Resource Saving</p>
              <p className="mt-1 text-sm font-medium text-emerald-400">{selectedRec.estimatedResourceSaving}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
              <p className="text-xs text-slate-400">Estimated Battery Saving</p>
              <p className="mt-1 text-sm font-medium text-emerald-400">{selectedRec.estimatedBatterySaving}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
              <p className="text-xs text-slate-400">Estimated Time Saving</p>
              <p className="mt-1 text-sm font-medium text-emerald-400">{selectedRec.estimatedTimeSaving}</p>
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <Button variant="success" icon={<FiCheck />} onClick={() => handleAction(selectedRec.id, 'Applied')}>Apply Recommendation</Button>
            <Button variant="danger" icon={<FiX />} onClick={() => handleAction(selectedRec.id, 'Dismissed')}>Reject</Button>
          </div>
        </div>
      )}

      {/* Recommendation History Table */}
      <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-glow backdrop-blur-xl">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-lg font-semibold text-white">Recommendation History</p>
          <div className="flex gap-2">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search..." value={historySearch} onChange={e => setHistorySearch(e.target.value)} className="rounded-lg border border-white/10 bg-white/5 py-1.5 pl-9 pr-4 text-sm text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none" />
            </div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white focus:border-sky-500 focus:outline-none">
              <option value="">All Statuses</option>
              <option value="New">New</option>
              <option value="Reviewed">Reviewed</option>
              <option value="Applied">Applied</option>
              <option value="Dismissed">Dismissed</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-white/10 bg-white/5">
              <tr>
                {['Title', 'Category', 'Priority', 'Status', 'Confidence', 'Satellite', 'Created', 'Applied By'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredHistory.map(r => (
                <tr key={r.id} className="transition hover:bg-white/5 cursor-pointer" onClick={() => setSelectedRec(r)}>
                  <td className="px-4 py-3 text-sm font-medium text-white">{r.title}</td>
                  <td className="px-4 py-3 text-sm text-slate-300">{r.category}</td>
                  <td className="px-4 py-3"><Badge variant={r.priority === 'Critical' ? 'danger' : r.priority === 'High' ? 'warning' : r.priority === 'Medium' ? 'info' : 'default'}>{r.priority}</Badge></td>
                  <td className="px-4 py-3"><Badge variant={getStatus(r) === 'Applied' ? 'success' : getStatus(r) === 'Dismissed' ? 'danger' : getStatus(r) === 'Reviewed' ? 'warning' : 'info'}>{getStatus(r)}</Badge></td>
                  <td className="px-4 py-3 text-sm text-sky-400">{r.confidenceScore}%</td>
                  <td className="px-4 py-3 text-sm text-slate-300">{r.affectedSatellite}</td>
                  <td className="px-4 py-3 text-xs text-slate-400">{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-xs text-slate-400">{r.appliedBy || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
