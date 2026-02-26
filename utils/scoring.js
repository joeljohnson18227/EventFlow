export const DEFAULT_SCORING_WEIGHTS = {
  innovation: 40,
  technicalDepth: 30,
  impact: 30,
};

export const normalizeWeights = (weights = {}) => {
  const safeWeights = {
    innovation: Number(weights.innovation),
    technicalDepth: Number(weights.technicalDepth),
    impact: Number(weights.impact),
  };

  if ([safeWeights.innovation, safeWeights.technicalDepth, safeWeights.impact].some(Number.isNaN)) {
    return { ...DEFAULT_SCORING_WEIGHTS };
  }

  const total = safeWeights.innovation + safeWeights.technicalDepth + safeWeights.impact;
  if (total <= 0) {
    return { ...DEFAULT_SCORING_WEIGHTS };
  }

  return {
    innovation: (safeWeights.innovation / total) * 100,
    technicalDepth: (safeWeights.technicalDepth / total) * 100,
    impact: (safeWeights.impact / total) * 100,
  };
};

export const calculateWeightedScore = (scores = {}, weights = DEFAULT_SCORING_WEIGHTS, maxScore = 10) => {
  const normalized = normalizeWeights(weights);
  const clamp = (value) => Math.max(0, Math.min(maxScore, Number(value) || 0));

  const total =
    (clamp(scores.innovation) / maxScore) * normalized.innovation +
    (clamp(scores.technicalDepth) / maxScore) * normalized.technicalDepth +
    (clamp(scores.impact) / maxScore) * normalized.impact;

  return Math.round(total * 100) / 100;
};
