import { motion } from 'framer-motion';

const LoadingSpinner = () => {
  return (
    <div className="flex min-h-[240px] items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
        className="h-12 w-12 rounded-full border-4 border-slate-700 border-t-sky-400"
      />
    </div>
  );
};

export default LoadingSpinner;
