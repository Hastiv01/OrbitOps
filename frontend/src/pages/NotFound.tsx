import { Link } from 'react-router-dom';
import { FiAlertTriangle, FiHome } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="rounded-3xl border border-white/10 bg-white/10 p-10 shadow-glow backdrop-blur-xl">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-400">
          <FiAlertTriangle className="text-3xl" />
        </div>
        <h2 className="text-3xl font-semibold text-white">404 — Page Not Found</h2>
        <p className="mt-3 max-w-md text-sm text-slate-400">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <FiHome />
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
