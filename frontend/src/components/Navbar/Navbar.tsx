import { FiBell, FiSearch, FiSettings, FiSun, FiMoon } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface NavbarProps {
  darkMode: boolean;
  onToggleTheme: () => void;
  onToggleSidebar?: () => void;
}

const Navbar = ({ darkMode, onToggleTheme }: NavbarProps) => {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-sky-300">Mission Control</p>
          <h1 className="text-xl font-semibold text-white">Intelligent Satellite Planner</h1>
        </div>

        <div className="flex items-center gap-3">
          <label className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 sm:flex">
            <FiSearch />
            <input
              className="w-40 bg-transparent outline-none placeholder:text-slate-500"
              placeholder="Search"
            />
          </label>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onToggleTheme}
            className="rounded-full border border-white/10 bg-white/10 p-2.5 text-slate-200 transition hover:bg-white/20"
          >
            {darkMode ? <FiSun /> : <FiMoon />}
          </motion.button>
          <button className="rounded-full border border-white/10 bg-white/10 p-2.5 text-slate-200 transition hover:bg-white/20">
            <FiBell />
          </button>
          <button className="rounded-full border border-sky-500/30 bg-sky-500/15 p-2.5 text-sky-300 transition hover:bg-sky-500/25">
            <FiSettings />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
