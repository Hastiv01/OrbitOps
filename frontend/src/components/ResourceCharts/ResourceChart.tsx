import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { ResourceData } from '../../types';

interface ResourceChartProps {
  data: ResourceData[];
}

const ResourceChart = ({ data }: ResourceChartProps) => {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-4 shadow-glow">
      <p className="mb-4 text-lg font-semibold text-white">Resource Trend</p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="rgba(148, 163, 184, 0.16)" strokeDasharray="4 4" />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Line type="monotone" dataKey="battery" stroke="#38bdf8" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="power" stroke="#8b5cf6" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ResourceChart;
