import { useState, useMemo } from 'react';
import { FiMoon, FiBell, FiShield, FiSliders, FiSun, FiSave, FiSearch, FiGlobe, FiRadio, FiServer } from 'react-icons/fi';
import { Badge, Button, Card, Tabs } from '../components/common/index';
import { satellites, groundStations } from '../data/mockData';
import { systemLogs } from '../data/extendedMockData';

const Settings = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState('en');
  const [notifications, setNotifications] = useState({ missions: true, battery: true, communication: true, payload: false, system: true, ai: true });
  const [profile, setProfile] = useState({ name: 'Mission Operator', email: 'operator@orbitops.space', role: 'Operator', timezone: 'UTC' });
  const [apiConfig, setApiConfig] = useState({ endpoint: 'https://api.orbitops.space/v1', apiKey: '', timeout: '30' });
  const [logSearch, setLogSearch] = useState('');
  const [logLevel, setLogLevel] = useState('');
  const [satMonitoring, setSatMonitoring] = useState<Record<string, boolean>>(Object.fromEntries(satellites.map(s => [s.id, s.status === 'Active'])));
  const [gsMonitoring, setGsMonitoring] = useState<Record<string, boolean>>(Object.fromEntries(groundStations.map(g => [g.id, g.status === 'Operational'])));

  const filteredLogs = useMemo(() => {
    return systemLogs.filter(l => {
      if (logSearch && !l.message.toLowerCase().includes(logSearch.toLowerCase()) && !l.source.toLowerCase().includes(logSearch.toLowerCase())) return false;
      if (logLevel && l.level !== logLevel) return false;
      return true;
    });
  }, [logSearch, logLevel]);

  const toggleSwitch = (checked: boolean, onChange: () => void) => (
    <button onClick={onChange} className={`relative h-6 w-11 rounded-full transition ${checked ? 'bg-sky-500' : 'bg-slate-600'}`}>
      <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${checked ? 'translate-x-5' : ''}`} />
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-800/80 p-6 shadow-glow">
        <p className="text-xs text-slate-500">Dashboard &gt; Settings</p>
        <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Settings</p>
        <h2 className="mt-2 text-3xl font-semibold text-white">Tune the mission control workspace</h2>
      </div>

      <Tabs tabs={[
        {
          id: 'general',
          label: 'General',
          content: (
            <div className="space-y-6">
              {/* Theme */}
              <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-glow backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-sky-500/15 p-2 text-sky-300">{darkMode ? <FiMoon /> : <FiSun />}</div>
                    <div>
                      <p className="font-semibold text-white">Theme</p>
                      <p className="text-sm text-slate-400">Switch between dark and light themes</p>
                    </div>
                  </div>
                  {toggleSwitch(darkMode, () => setDarkMode(!darkMode))}
                </div>
              </div>

              {/* Language */}
              <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-glow backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-xl bg-sky-500/15 p-2 text-sky-300"><FiGlobe /></div>
                  <div>
                    <p className="font-semibold text-white">Language is English.</p>
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-glow backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-xl bg-sky-500/15 p-2 text-sky-300"><FiBell /></div>
                  <div>
                    <p className="font-semibold text-white">Notifications</p>
                    <p className="text-sm text-slate-400">Control which alerts you receive</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { key: 'missions' as const, label: 'Mission Alerts' },
                    { key: 'battery' as const, label: 'Battery Warnings' },
                    { key: 'communication' as const, label: 'Communication Events' },
                    { key: 'payload' as const, label: 'Payload Status' },
                    { key: 'system' as const, label: 'System Updates' },
                    { key: 'ai' as const, label: 'AI Recommendations' },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3">
                      <span className="text-sm text-white">{item.label}</span>
                      {toggleSwitch(notifications[item.key], () => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key] })))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ),
        },
        {
          id: 'profile',
          label: 'Profile & API',
          content: (
            <div className="space-y-6">
              {/* Profile */}
              <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-glow backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-xl bg-sky-500/15 p-2 text-sky-300"><FiShield /></div>
                  <div>
                    <p className="font-semibold text-white">Profile</p>
                    <p className="text-sm text-slate-400">Manage your operator profile</p>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
                    <input type="text" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-sky-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                    <input type="email" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-sky-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Role</label>
                    <select value={profile.role} onChange={e => setProfile({ ...profile, role: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-sky-500 focus:outline-none">
                      <option value="Operator">Operator</option>
                      <option value="Administrator">Administrator</option>
                      <option value="Analyst">Analyst</option>
                      <option value="Viewer">Viewer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Timezone</label>
                    <select value={profile.timezone} onChange={e => setProfile({ ...profile, timezone: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-sky-500 focus:outline-none">
                      <option value="UTC">UTC</option>
                      <option value="EST">EST (UTC-5)</option>
                      <option value="CET">CET (UTC+1)</option>
                      <option value="IST">IST (UTC+5:30)</option>
                      <option value="JST">JST (UTC+9)</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4"><Button variant="primary" icon={<FiSave />}>Save Profile</Button></div>
              </div>

              {/* API Configuration */}
              <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-glow backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-xl bg-sky-500/15 p-2 text-sky-300"><FiSliders /></div>
                  <div>
                    <p className="font-semibold text-white">API Configuration</p>
                    <p className="text-sm text-slate-400">Configure service endpoints</p>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-slate-300 mb-1">API Endpoint URL</label>
                    <input type="url" value={apiConfig.endpoint} onChange={e => setApiConfig({ ...apiConfig, endpoint: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-sky-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">API Key</label>
                    <input type="password" value={apiConfig.apiKey} onChange={e => setApiConfig({ ...apiConfig, apiKey: e.target.value })} placeholder="Enter API key" className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Timeout (seconds)</label>
                    <input type="number" value={apiConfig.timeout} onChange={e => setApiConfig({ ...apiConfig, timeout: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-sky-500 focus:outline-none" />
                  </div>
                </div>
                <div className="mt-4 flex gap-3">
                  <Button variant="secondary">Test Connection</Button>
                  <Button variant="primary" icon={<FiSave />}>Save Configuration</Button>
                </div>
              </div>
            </div>
          ),
        },
        {
          id: 'fleet',
          label: 'Fleet Config',
          content: (
            <div className="space-y-6">
              {/* Satellite Configuration */}
              <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-glow backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-xl bg-sky-500/15 p-2 text-sky-300"><FiRadio /></div>
                  <p className="font-semibold text-white">Satellite Monitoring</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-white/10 bg-white/5">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">Orbit</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400">Monitoring</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {satellites.map(sat => (
                        <tr key={sat.id} className="transition hover:bg-white/5">
                          <td className="px-4 py-3 text-sm font-medium text-white">{sat.name}</td>
                          <td className="px-4 py-3"><Badge variant={sat.status === 'Active' ? 'success' : sat.status === 'Maintenance' ? 'warning' : 'danger'}>{sat.status}</Badge></td>
                          <td className="px-4 py-3 text-sm text-slate-300">{sat.orbit}</td>
                          <td className="px-4 py-3 text-right">{toggleSwitch(satMonitoring[sat.id] ?? true, () => setSatMonitoring(prev => ({ ...prev, [sat.id]: !prev[sat.id] })))}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Ground Station Configuration */}
              <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-glow backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-xl bg-sky-500/15 p-2 text-sky-300"><FiServer /></div>
                  <p className="font-semibold text-white">Ground Station Monitoring</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-white/10 bg-white/5">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">Country</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">Status</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400">Monitoring</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {groundStations.map(gs => (
                        <tr key={gs.id} className="transition hover:bg-white/5">
                          <td className="px-4 py-3 text-sm font-medium text-white">{gs.name}</td>
                          <td className="px-4 py-3 text-sm text-slate-300">{gs.country}</td>
                          <td className="px-4 py-3"><Badge variant={gs.status === 'Operational' ? 'success' : gs.status === 'Maintenance' ? 'warning' : 'danger'}>{gs.status}</Badge></td>
                          <td className="px-4 py-3 text-right">{toggleSwitch(gsMonitoring[gs.id] ?? true, () => setGsMonitoring(prev => ({ ...prev, [gs.id]: !prev[gs.id] })))}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ),
        },
        {
          id: 'logs',
          label: 'System Logs',
          content: (
            <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-glow backdrop-blur-xl">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-lg font-semibold text-white">System Logs</p>
                <div className="flex gap-2">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" placeholder="Search logs..." value={logSearch} onChange={e => setLogSearch(e.target.value)} className="rounded-lg border border-white/10 bg-white/5 py-1.5 pl-9 pr-4 text-sm text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none" />
                  </div>
                  <select value={logLevel} onChange={e => setLogLevel(e.target.value)} className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white focus:border-sky-500 focus:outline-none">
                    <option value="">All Levels</option>
                    <option value="INFO">INFO</option>
                    <option value="WARN">WARN</option>
                    <option value="ERROR">ERROR</option>
                    <option value="DEBUG">DEBUG</option>
                  </select>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-white/10 bg-white/5">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">Timestamp</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">Level</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">Source</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">Message</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredLogs.map(log => (
                      <tr key={log.id} className="transition hover:bg-white/5">
                        <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                        <td className="px-4 py-3"><Badge variant={log.level === 'ERROR' ? 'danger' : log.level === 'WARN' ? 'warning' : log.level === 'INFO' ? 'info' : 'default'}>{log.level}</Badge></td>
                        <td className="px-4 py-3 text-sm text-sky-400">{log.source}</td>
                        <td className="px-4 py-3 text-sm text-slate-300">{log.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ),
        },
      ]} defaultTab="general" />
    </div>
  );
};

export default Settings;
