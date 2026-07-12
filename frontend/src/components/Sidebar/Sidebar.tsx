import { NavLink } from 'react-router-dom';
import { FiBarChart2, FiCpu, FiGrid, FiPackage, FiRadio, FiSettings, FiTrendingUp, FiZap } from 'react-icons/fi';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const links = [
  { to: '/', label: 'Dashboard', icon: FiGrid },
  { to: '/missions', label: 'Mission Planning', icon: FiPackage },
  { to: '/operations', label: 'Satellite Operations', icon: FiRadio },
  { to: '/resources', label: 'Resources', icon: FiCpu },
  { to: '/recommendations', label: 'Recommendations', icon: FiTrendingUp },
  { to: '/analytics', label: 'Analytics', icon: FiBarChart2 },
  { to: '/settings', label: 'Settings', icon: FiSettings },
];

const Sidebar = ({ isOpen, onClose }: SidebarProps = {}) => {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-slate-950/70 p-6 lg:flex lg:flex-col">
      <div className="mb-8 flex items-center gap-3">
        <div className="rounded-2xl bg-gradient-to-br from-sky-500 to-violet-500 p-3 text-white shadow-glow">
          <FiZap />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Orbital AI</p>
          <p className="text-xs text-slate-400">Command Center</p>
        </div>
      </div>

      <nav className="space-y-2">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? 'bg-sky-500/15 text-sky-300 shadow-glow'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Icon className="text-lg" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto rounded-3xl border border-sky-500/20 bg-slate-900/80 p-4">
        <p className="text-sm font-semibold text-white">Mission health</p>
        <p className="mt-2 text-xs text-slate-400">All orbital assets are nominal with 3 high-priority tasks queued.</p>
      </div>
    </aside>
  );
};

export default Sidebar;
