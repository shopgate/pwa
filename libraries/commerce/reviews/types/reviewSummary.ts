/**
 * The review summary of a product as provided by its product data.
 */
export interface ReviewSummary {
  /** Average rating on the 0–100 scale of the product data; null when not provided. */
  average: number | null;
  /** Number of ratings incl. star-only ratings; differs from the list's totalReviewCount. */
  count: number | null;
}
