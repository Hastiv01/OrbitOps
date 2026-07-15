import { FiBell, FiSearch, FiSettings, FiSun, FiMoon } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface NavbarProps {
  darkMode: boolean;
  onToggleTheme: () => void;
  onToggleSidebar?: () => void;
}

const Navbar = ({ darkMode, onToggleTheme }: NavbarProps) => {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/80 print:hidden">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-sky-600 dark:text-sky-300">Mission Control</p>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Intelligent Satellite Planner</h1>
        </div>

        <div className="flex items-center gap-3">
          <label className="hidden items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 sm:flex dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
            <FiSearch className="text-slate-400" />
            <input
              className="w-40 bg-transparent text-slate-900 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-500"
              placeholder="Search"
            />
          </label>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onToggleTheme}
            className="rounded-full border border-slate-200 bg-slate-100 p-2.5 text-slate-500 transition hover:bg-slate-200 dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/20"
          >
            {darkMode ? <FiSun /> : <FiMoon />}
          </motion.button>
          <button className="rounded-full border border-slate-200 bg-slate-100 p-2.5 text-slate-500 transition hover:bg-slate-200 dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/20">
            <FiBell />
          </button>
          <button className="rounded-full border border-sky-200 bg-sky-50 p-2.5 text-sky-600 transition hover:bg-sky-100 dark:border-sky-500/30 dark:bg-sky-500/15 dark:text-sky-300 dark:hover:bg-sky-500/25">
            <FiSettings />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
