import type { ReviewRatingDistribution, ReviewSummary } from '../types/reviewSummary';

const STARS = ['5', '4', '3', '2', '1'] as const;

/**
 * @param value A value from a pipeline response.
 * @returns Whether the value is a finite number.
 */
const isFiniteNumber = (value: unknown): value is number => (
  typeof value === 'number' && Number.isFinite(value)
);

/**
 * Reduces the distribution of a pipeline response to the counts per number of stars.
 * @param value The distribution of a pipeline response.
 * @returns The distribution, or undefined unless all five counts are numbers of at least 0.
 */
const normalizeDistribution = (value: unknown): ReviewRatingDistribution | undefined => {
  if (!value || typeof value !== 'object') {
    return undefined;
  }

  const counts = value as Record<string, unknown>;
  const distribution = {} as ReviewRatingDistribution;

  for (let index = 0; index < STARS.length; index += 1) {
    const count = counts[STARS[index]];

    if (!isFiniteNumber(count) || count < 0) {
      return undefined;
    }

    distribution[STARS[index]] = count;
  }

  return distribution;
};

/**
 * Reduces the summary of a review list response to the review summary of the PWA.
 * @param value The summary of a pipeline response.
 * @returns The summary, or null when it has no numeric average.
 */
export const normalizeReviewSummary = (value: unknown): ReviewSummary | null => {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const { average, count, distribution } = value as Record<string, unknown>;

  if (!isFiniteNumber(average)) {
    return null;
  }

  const normalizedDistribution = normalizeDistribution(distribution);

  return {
    average,
    count: isFiniteNumber(count) && count >= 0 ? count : null,
    ...(normalizedDistribution && { distribution: normalizedDistribution }),
  };
};
