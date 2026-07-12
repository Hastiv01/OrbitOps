interface ErrorStateProps {
  message?: string;
}

const ErrorState = ({ message = 'Unable to load dashboard data.' }: ErrorStateProps) => {
  return (
    <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6 text-sm text-rose-200">
      <p className="font-semibold">Data unavailable</p>
      <p className="mt-2">{message}</p>
    </div>
  );
};

export default ErrorState;
