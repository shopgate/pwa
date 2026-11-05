/**
 * The number of ratings per number of stars, from 5 to 1.
 */
export type ReviewRatingDistribution = Record<'5' | '4' | '3' | '2' | '1', number>;

/**
 * The review summary of a product, from the review provider or from the product data.
 */
export interface ReviewSummary {
  /** Average rating on the 0–100 scale; null when not provided. */
  average: number | null;
  /** Number of ratings incl. star-only ratings; differs from the list's totalReviewCount. */
  count: number | null;
  /** Only set when the review provider delivers a complete distribution. */
  distribution?: ReviewRatingDistribution;
}
