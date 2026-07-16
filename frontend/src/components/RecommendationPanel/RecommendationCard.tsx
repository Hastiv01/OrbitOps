import type { Recommendation } from '../../data/mockData';

interface RecommendationCardProps {
  recommendation: Recommendation;
}

const RecommendationCard = ({ recommendation }: RecommendationCardProps) => {
  const riskTone =
    recommendation.priority === 'Critical' || recommendation.priority === 'High'
      ? 'border-rose-500/30 bg-rose-500/10 text-rose-200'
      : recommendation.priority === 'Medium'
        ? 'border-amber-400/30 bg-amber-500/10 text-amber-200'
        : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200';

  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-700 print:border-slate-300 bg-white dark:bg-slate-950/70 p-4 shadow-sm dark:shadow-glow print:shadow-none">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-slate-900 dark:text-white print:text-black">{recommendation.title}</p>
        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${riskTone}`}>
          {recommendation.priority}
        </span>
      </div>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 print:text-slate-700">{recommendation.description}</p>
      <div className="mt-4 flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300 print:text-slate-800">
        <span className="font-medium">Impact: {recommendation.impact}</span>
        <span>Category: {recommendation.category}</span>
      </div>
    </div>
  );
};

export default RecommendationCard;
