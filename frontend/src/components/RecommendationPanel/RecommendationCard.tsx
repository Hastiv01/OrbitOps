import type { Recommendation } from '../../types';

interface RecommendationCardProps {
  recommendation: Recommendation;
}

const RecommendationCard = ({ recommendation }: RecommendationCardProps) => {
  const riskTone =
    recommendation.risk === 'High'
      ? 'border-rose-500/30 bg-rose-500/10 text-rose-200'
      : recommendation.risk === 'Medium'
        ? 'border-amber-400/30 bg-amber-500/10 text-amber-200'
        : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200';

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-4 shadow-glow">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-white">{recommendation.title}</p>
        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${riskTone}`}>
          {recommendation.risk}
        </span>
      </div>
      <p className="mt-3 text-sm text-slate-400">{recommendation.description}</p>
      <div className="mt-4 flex items-center justify-between text-sm text-slate-300">
        <span>{recommendation.category}</span>
        <span>{recommendation.confidence}% confidence</span>
      </div>
    </div>
  );
};

export default RecommendationCard;
