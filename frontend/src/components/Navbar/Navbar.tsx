import { useState, useRef, useEffect } from 'react';
import { FiBell, FiSearch, FiSettings, FiSun, FiMoon, FiCheck } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../hooks';

interface NavbarProps {
  darkMode: boolean;
  onToggleTheme: () => void;
  onToggleSidebar?: () => void;
}

const Navbar = ({ darkMode, onToggleTheme }: NavbarProps) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { addToast } = useNotification();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllRead = () => {
    setUnreadCount(0);
    setShowNotifications(false);
    addToast('All notifications marked as read', 'success');
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-950/80 print:hidden">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-sky-600 dark:text-sky-300">Mission Control</p>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Intelligent Satellite Planner</h1>
        </div>

        <div className="flex items-center gap-3">
          <label className="hidden items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 sm:flex dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 focus-within:ring-2 focus-within:ring-sky-500 transition-all">
            <FiSearch className="text-slate-400" />
            <input
              className="w-40 bg-transparent text-slate-900 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-500"
              placeholder="Search"
            />
          </label>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onToggleTheme}
            aria-label="Toggle Theme"
            className="rounded-full border border-slate-200 bg-slate-100 p-2.5 text-slate-500 transition-all hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <motion.div
              initial={false}
              animate={{ rotate: darkMode ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {darkMode ? <FiSun /> : <FiMoon />}
            </motion.div>
          </motion.button>
          
          <div className="relative" ref={dropdownRef}>
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Notifications"
              className="relative rounded-full border border-slate-200 bg-slate-100 p-2.5 text-slate-500 transition-all hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <FiBell />
              {unreadCount > 0 && (
                <span className="absolute right-0 top-0 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
                  {unreadCount}
                </span>
              )}
            </motion.button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/50">
                    <span className="font-semibold text-slate-900 dark:text-white">Notifications</span>
                    <button onClick={markAllRead} className="flex items-center gap-1 text-xs text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300">
                      <FiCheck /> Mark all read
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto p-2">
                    {unreadCount > 0 ? (
                      [...Array(unreadCount)].map((_, i) => (
                        <div key={i} className="mb-1 cursor-pointer rounded-xl px-3 py-2 transition hover:bg-slate-50 dark:hover:bg-slate-700/50">
                          <p className="text-sm font-medium text-slate-900 dark:text-white">System Alert {i + 1}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Optimization completed successfully.</p>
                        </div>
                      ))
                    ) : (
                      <div className="py-6 text-center text-slate-500 dark:text-slate-400">
                        <FiBell className="mx-auto mb-2 text-2xl opacity-50" />
                        <p className="text-sm">No new notifications</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/settings')}
            aria-label="Settings"
            className="rounded-full border border-sky-200 bg-sky-50 p-2.5 text-sky-600 transition-all hover:bg-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-sky-500/30 dark:bg-sky-500/15 dark:text-sky-300 dark:hover:bg-sky-500/25"
          >
            <FiSettings className="transition-transform duration-300 hover:rotate-90" />
          </motion.button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
