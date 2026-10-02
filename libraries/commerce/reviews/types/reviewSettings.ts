export type ReviewPaginationType = 'offset' | 'cursor';

/**
 * Provider review capabilities returned by shopgate.catalog.getProductReviewSettings.v1.
 */
export interface ReviewSettings {
  /** Optional capabilities the provider supports; the PWA only acts on identifiers it knows. */
  features: string[];
  /** Whether the review list paginates by offset or cursor. */
  paginationType: ReviewPaginationType;
  /** Provider custom-field definitions; not consumed for display in the first delivery. */
  customFields: unknown[];
}

/**
 * The review settings redux slice: the loaded settings plus request bookkeeping.
 * Empty before the first successful load, so every settings field is optional here.
 */
export interface ReviewSettingsSliceState extends Partial<ReviewSettings> {
  isFetching?: boolean;
  expires?: number;
}

/**
 * Minimal application state shape the review settings selectors read from.
 */
export interface ReviewSettingsState {
  reviews?: {
    reviewSettings?: ReviewSettingsSliceState;
  };
}
