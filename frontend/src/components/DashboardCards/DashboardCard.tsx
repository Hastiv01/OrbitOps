import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface DashboardCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: ReactNode;
  accent?: string;
}

const DashboardCard = ({ title, value, subtitle, icon, accent = 'from-sky-500 to-violet-500' }: DashboardCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-glow backdrop-blur-xl"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
        </div>
        {icon ? <div className={`rounded-2xl bg-gradient-to-br ${accent} p-3 text-white`}>{icon}</div> : null}
      </div>
      {subtitle ? <p className="mt-3 text-sm text-slate-400">{subtitle}</p> : null}
    </motion.div>
  );
};

export default DashboardCard;
