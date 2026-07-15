import { NavLink } from 'react-router-dom';
import { FiBarChart2, FiCpu, FiGrid, FiPackage, FiRadio, FiSettings, FiTrendingUp, FiZap, FiCalendar, FiTarget, FiGlobe, FiHardDrive, FiFileText } from 'react-icons/fi';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const links = [
  { to: '/', label: 'Dashboard', icon: FiGrid },
  { to: '/missions', label: 'Mission Planning', icon: FiPackage },
  { to: '/scheduler', label: 'Mission Scheduler', icon: FiCalendar },
  { to: '/optimization', label: 'Optimization', icon: FiTarget },
  { to: '/operations', label: 'Satellite Operations', icon: FiRadio },
  { to: '/ground-stations', label: 'Ground Stations', icon: FiGlobe },
  { to: '/payloads', label: 'Payload Planner', icon: FiHardDrive },
  { to: '/resources', label: 'Resources', icon: FiCpu },
  { to: '/recommendations', label: 'Recommendations', icon: FiTrendingUp },
  { to: '/analytics', label: 'Analytics', icon: FiBarChart2 },
  { to: '/reports', label: 'Reports', icon: FiFileText },
  { to: '/settings', label: 'Settings', icon: FiSettings },
];

const Sidebar = ({ isOpen, onClose }: SidebarProps = {}) => {
  return (
    <aside className="hidden w-72 shrink-0 flex-col border-r border-slate-200 bg-white p-6 lg:flex dark:border-white/10 dark:bg-slate-950/70 print:hidden">
      <div className="mb-8 flex items-center gap-3">
        <div className="rounded-2xl bg-gradient-to-br from-sky-500 to-violet-500 p-3 text-white shadow-sm dark:shadow-glow">
          <FiZap />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Orbital AI</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Command Center</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium transition ${
                isActive
                  ? 'bg-sky-50 text-sky-600 shadow-sm dark:bg-sky-500/15 dark:text-sky-300 dark:shadow-glow'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white'
              }`
            }
          >
            <Icon className="text-lg" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto rounded-3xl border border-sky-200 bg-slate-50 p-4 dark:border-sky-500/20 dark:bg-slate-900/80">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">Mission health</p>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">All orbital assets are nominal with 3 high-priority tasks queued.</p>
      </div>
    </aside>
  );
};

export default Sidebar;