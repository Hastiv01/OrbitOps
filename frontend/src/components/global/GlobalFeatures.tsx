import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBell, FiCommand, FiHelpCircle, FiMessageCircle, FiSearch, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { missionAlerts, recentActivities } from '../../data/extendedMockData';
import { missions, satellites } from '../../data/mockData';
import { Button, Badge } from '../common/index';

interface GlobalFeaturesContextType {
  openSearch: () => void;
  openCommandPalette: () => void;
  openNotifications: () => void;
  openHelp: () => void;
  toggleAiAssistant: () => void;
}

const GlobalFeaturesContext = createContext<GlobalFeaturesContextType | null>(null);

export const useGlobalFeatures = () => {
  const ctx = useContext(GlobalFeaturesContext);
  if (!ctx) throw new Error('useGlobalFeatures must be used within GlobalFeaturesProvider');
  return ctx;
};

const routes = [
  { label: 'Dashboard', path: '/' },
  { label: 'Mission Planning', path: '/missions' },
  { label: 'Satellite Operations', path: '/operations' },
  { label: 'Resources', path: '/resources' },
  { label: 'Recommendations', path: '/recommendations' },
  { label: 'Analytics', path: '/analytics' },
  { label: 'Mission Scheduler', path: '/scheduler' },
  { label: 'Constraint Optimization', path: '/optimization' },
  { label: 'Ground Station Planner', path: '/ground-stations' },
  { label: 'Payload Planner', path: '/payloads' },
  { label: 'Reports', path: '/reports' },
  { label: 'Settings', path: '/settings' },
];

const shortcuts = [
  { keys: 'Ctrl + K', action: 'Open command palette' },
  { keys: 'Ctrl + /', action: 'Open search' },
  { keys: 'Ctrl + B', action: 'Toggle notifications' },
  { keys: 'Ctrl + H', action: 'Open help center' },
  { keys: 'Ctrl + J', action: 'Toggle AI assistant' },
];

export const GlobalFeaturesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [commandQuery, setCommandQuery] = useState('');
  const [aiMessage, setAiMessage] = useState('');
  const [aiHistory, setAiHistory] = useState<Array<{ role: 'user' | 'ai'; text: string }>>([
    { role: 'ai', text: 'Hello! I can help with mission scheduling, resource optimization, and satellite health analysis.' },
  ]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    const missionResults = missions
      .filter((m) => m.name.toLowerCase().includes(q) || m.missionId.toLowerCase().includes(q))
      .slice(0, 5)
      .map((m) => ({ type: 'Mission', label: m.name, path: '/missions' }));
    const satResults = satellites
      .filter((s) => s.name.toLowerCase().includes(q))
      .slice(0, 5)
      .map((s) => ({ type: 'Satellite', label: s.name, path: '/operations' }));
    const routeResults = routes
      .filter((r) => r.label.toLowerCase().includes(q))
      .map((r) => ({ type: 'Page', label: r.label, path: r.path }));
    return [...routeResults, ...missionResults, ...satResults].slice(0, 10);
  }, [searchQuery]);

  const commandResults = useMemo(() => {
    const q = commandQuery.toLowerCase();
    return routes.filter((r) => r.label.toLowerCase().includes(q));
  }, [commandQuery]);

  const navigateTo = useCallback(
    (path: string) => {
      navigate(path);
      setSearchOpen(false);
      setCommandOpen(false);
      setSearchQuery('');
      setCommandQuery('');
    },
    [navigate]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        setCommandOpen((v) => !v);
      }
      if (e.ctrlKey && e.key === '/') {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
      if (e.ctrlKey && e.key === 'b') {
        e.preventDefault();
        setNotificationsOpen((v) => !v);
      }
      if (e.ctrlKey && e.key === 'h') {
        e.preventDefault();
        setHelpOpen((v) => !v);
      }
      if (e.ctrlKey && e.key === 'j') {
        e.preventDefault();
        setAiOpen((v) => !v);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setCommandOpen(false);
        setNotificationsOpen(false);
        setHelpOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const sendAiMessage = () => {
    if (!aiMessage.trim()) return;
    const userMsg = aiMessage.trim();
    setAiHistory((h) => [
      ...h,
      { role: 'user', text: userMsg },
      {
        role: 'ai',
        text: `Based on current telemetry, I recommend reviewing ${missions[0]?.name ?? 'active missions'} and checking battery levels on SatelliteEight. Would you like me to open the scheduler?`,
      },
    ]);
    setAiMessage('');
  };

  const ctx: GlobalFeaturesContextType = {
    openSearch: () => setSearchOpen(true),
    openCommandPalette: () => setCommandOpen(true),
    openNotifications: () => setNotificationsOpen(true),
    openHelp: () => setHelpOpen(true),
    toggleAiAssistant: () => setAiOpen((v) => !v),
  };

  return (
    <GlobalFeaturesContext.Provider value={ctx}>
      {children}

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <Overlay onClose={() => setSearchOpen(false)}>
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
              <FiSearch className="text-slate-400" />
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search missions, satellites, pages..."
                className="flex-1 bg-transparent text-white outline-none placeholder:text-slate-500"
              />
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {searchResults.length === 0 ? (
                <p className="p-4 text-center text-sm text-slate-400">Type to search across the mission control system</p>
              ) : (
                searchResults.map((item, i) => (
                  <button
                    key={`${item.label}-${i}`}
                    onClick={() => navigateTo(item.path)}
                    className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition hover:bg-white/10"
                  >
                    <span className="text-white">{item.label}</span>
                    <Badge variant="info">{item.type}</Badge>
                  </button>
                ))
              )}
            </div>
          </Overlay>
        )}
      </AnimatePresence>

      {/* Command Palette */}
      <AnimatePresence>
        {commandOpen && (
          <Overlay onClose={() => setCommandOpen(false)}>
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
              <FiCommand className="text-slate-400" />
              <input
                autoFocus
                value={commandQuery}
                onChange={(e) => setCommandQuery(e.target.value)}
                placeholder="Jump to page or run action..."
                className="flex-1 bg-transparent text-white outline-none placeholder:text-slate-500"
              />
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {commandResults.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigateTo(item.path)}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition hover:bg-white/10"
                >
                  <span className="text-white">{item.label}</span>
                  <span className="text-xs text-slate-500">{item.path}</span>
                </button>
              ))}
              <button
                onClick={() => {
                  navigate('/optimization');
                  setCommandOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition hover:bg-white/10"
              >
                <span className="text-white">Run Optimization</span>
              </button>
            </div>
          </Overlay>
        )}
      </AnimatePresence>

      {/* Notification Center */}
      <AnimatePresence>
        {notificationsOpen && (
          <SidePanel title="Notification Center" onClose={() => setNotificationsOpen(false)} icon={<FiBell />}>
            <div className="space-y-3">
              {missionAlerts.filter((a) => !a.acknowledged).map((alert) => (
                <div key={alert.id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
                  <div className="flex items-center justify-between">
                    <Badge variant={alert.severity === 'Critical' ? 'danger' : alert.severity === 'High' ? 'warning' : 'info'}>
                      {alert.type}
                    </Badge>
                    <span className="text-xs text-slate-500">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="mt-2 font-medium text-white">{alert.title}</p>
                  <p className="mt-1 text-sm text-slate-400">{alert.message}</p>
                </div>
              ))}
            </div>
          </SidePanel>
        )}
      </AnimatePresence>

      {/* Help Center */}
      <AnimatePresence>
        {helpOpen && (
          <SidePanel title="Help Center" onClose={() => setHelpOpen(false)} icon={<FiHelpCircle />}>
            <p className="mb-4 text-sm text-slate-400">Keyboard shortcuts for mission control operations.</p>
            <div className="space-y-2">
              {shortcuts.map((s) => (
                <div key={s.keys} className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/60 px-4 py-2">
                  <span className="text-sm text-slate-300">{s.action}</span>
                  <kbd className="rounded bg-white/10 px-2 py-1 text-xs text-sky-300">{s.keys}</kbd>
                </div>
              ))}
            </div>
          </SidePanel>
        )}
      </AnimatePresence>

      {/* Floating AI Assistant */}
      <AnimatePresence>
        {aiOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 right-4 z-50 w-80 rounded-2xl border border-white/10 bg-slate-900/95 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-2 text-white">
                <FiMessageCircle className="text-sky-400" />
                <span className="font-medium">AI Assistant</span>
              </div>
              <button onClick={() => setAiOpen(false)} className="text-slate-400 hover:text-white">
                <FiX />
              </button>
            </div>
            <div className="max-h-64 space-y-2 overflow-y-auto p-4">
              {aiHistory.map((msg, i) => (
                <div
                  key={i}
                  className={`rounded-xl px-3 py-2 text-sm ${
                    msg.role === 'user' ? 'ml-4 bg-sky-500/20 text-sky-100' : 'mr-4 bg-white/5 text-slate-300'
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>
            <div className="flex gap-2 border-t border-white/10 p-3">
              <input
                value={aiMessage}
                onChange={(e) => setAiMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendAiMessage()}
                placeholder="Ask about missions..."
                className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none"
              />
              <Button size="sm" onClick={sendAiMessage}>
                Send
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Activity timeline floating access via AI button */}
      <button
        onClick={() => setAiOpen((v) => !v)}
        className="fixed bottom-4 right-4 z-40 rounded-full border border-sky-500/30 bg-sky-500/20 p-4 text-sky-300 shadow-glow transition hover:bg-sky-500/30"
        title="AI Assistant (Ctrl+J)"
      >
        <FiMessageCircle className="text-xl" />
      </button>
    </GlobalFeaturesContext.Provider>
  );
};

const Overlay: React.FC<{ children: React.ReactNode; onClose: () => void }> = ({ children, onClose }) => (
  <>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
    />
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      className="fixed left-1/2 top-24 z-50 w-full max-w-lg -translate-x-1/2 rounded-2xl border border-white/10 bg-slate-900/95 shadow-2xl backdrop-blur-xl"
    >
      {children}
    </motion.div>
  </>
);

const SidePanel: React.FC<{
  title: string;
  onClose: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, onClose, icon, children }) => (
  <>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
    />
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className="fixed right-0 top-0 z-50 h-full w-full max-w-md border-l border-white/10 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-xl"
    >
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white">
          {icon}
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
        <button onClick={onClose} className="rounded-lg bg-white/10 p-2 text-slate-300 hover:text-white">
          <FiX />
        </button>
      </div>
      {children}
    </motion.div>
  </>
);

export { recentActivities as globalActivityTimeline };
