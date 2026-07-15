import { Link } from 'react-router-dom';
import { FiAlertTriangle, FiHome } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="rounded-3xl border border-slate-200 dark:border-white/10 print:border-slate-300 bg-white dark:bg-white/10 print:bg-white p-10 shadow-sm dark:shadow-glow print:shadow-none backdrop-blur-xl">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-400">
          <FiAlertTriangle className="text-3xl" />
        </div>
        <h2 className="text-3xl font-semibold text-slate-900 dark:text-white print:text-black">404 — Page Not Found</h2>
        <p className="mt-3 max-w-md text-sm text-slate-500 dark:text-slate-400 print:text-slate-700">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-violet-500 px-6 py-3 text-sm font-semibold text-slate-900 dark:text-white print:text-black transition hover:opacity-90"
        >
          <FiHome />
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
