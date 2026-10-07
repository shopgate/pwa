import type { ReviewSettingsSliceState } from './reviewSettings';

export type ReviewId = string | number;

/**
 * A reply of the merchant to a product review.
 */
export interface ReviewMerchantReply {
  author?: string;
  date?: string;
  /** Plain text; never rendered as HTML. */
  reply?: string;
}

/**
 * A provider-defined label/value pair attached to a product review.
 */
export interface ReviewCustomField {
  label: string;
  value: string;
}

/**
 * An image or video attached to a product review.
 */
export interface ReviewMediaItem {
  type: 'image' | 'video';
  url: string;
}

/**
 * The helpfulness votes of a product review.
 */
export interface ReviewRate {
  up?: number;
  down?: number;
}

export type ReviewVote = 'up' | 'down';

/**
 * A product review as stored in the reviews slice.
 */
export interface Review {
  id: ReviewId;
  author?: string;
  date?: string;
  rate: number;
  title?: string;
  review?: string;
  /** Only set on reviews that were submitted from the write form. */
  productId?: string;
  /** A missing value is unknown, which differs from an explicit `false`. */
  isVerified?: boolean;
  merchantReply?: ReviewMerchantReply;
  customFields?: ReviewCustomField[];
  media?: ReviewMediaItem[];
  /** Missing counts are unknown, which differs from an explicit zero. */
  reviewRate?: ReviewRate;
}

/**
 * Request bookkeeping that ties a review list response to the request that caused it.
 */
export interface ReviewsRequestMeta {
  requestId?: number;
  offset?: number;
  /** Opaque sort value; extensions may pass their own format. */
  sort?: string;
  /** Only set when the list is restricted to reviews with media. */
  filterMedia?: boolean;
}

/**
 * A full review list stored under its request hash.
 */
export interface ReviewsCollection {
  reviews?: ReviewId[];
  totalReviewCount?: number | null;
  sort?: string;
  isFetching?: boolean;
  expires?: number;
  requestId?: number;
  requestOffset?: number;
  requestSort?: string;
  requestFilterMedia?: boolean;
  /** Whether the stored reviews were loaded with the media filter. */
  filterMedia?: boolean;
  /** Cursor for the next page; null when the provider returned none. */
  after?: string | null;
}

/**
 * The review preview of a product stored under its product id.
 */
export interface ProductReviewsCollection {
  reviews?: ReviewId[];
  totalReviewCount?: number | null;
  sort?: string;
  isFetching?: boolean;
  expires?: number;
  requestId?: number;
}

/**
 * The own review reference of the logged-in user for a product.
 */
export interface UserReviewReference {
  review?: ReviewId;
  isFetching?: boolean;
  expires?: number;
}

export type ReviewsById = Record<string, Review>;
export type ReviewsByHash = Record<string, ReviewsCollection>;
export type ReviewsByProductId = Record<string, ProductReviewsCollection>;
export type UserReviewsByProductId = Record<string, UserReviewReference>;

/**
 * The review list parts of the reviews redux slice.
 */
export interface ReviewsSliceState {
  reviewsById: ReviewsById;
  reviewsByHash: ReviewsByHash;
  reviewsByProductId: ReviewsByProductId;
  userReviewsByProductId: UserReviewsByProductId;
  reviewSettings?: ReviewSettingsSliceState;
}

/**
 * Minimal application state shape the review list selectors read from.
 */
export interface ReviewsState {
  reviews: ReviewsSliceState;
}

/**
 * Application state shape for review selectors that also resolve the base product.
 */
export type ReviewsProductState = ReviewsState & { product: unknown };

/**
 * Selector props that identify a product and optionally one of its variants.
 */
export interface ReviewsProductProps {
  productId?: string | null;
  variantId?: string | null;
}

/**
 * The review switches of the app config.
 */
export interface ReviewsConfig {
  hasReviews?: boolean;
  showWriteReview?: boolean;
}

/**
 * The votes the user of this device gave, stored by review id outside the reviews slice so
 * that an app reset keeps them.
 */
export type ReviewVotes = Record<string, ReviewVote>;

/**
 * Minimal application state shape the review vote selectors read from.
 */
export interface ReviewVotesState {
  reviewVotes?: ReviewVotes;
}

/**
 * The pipeline response of shopgate.catalog.getProductReviews.v1.
 */
export interface ProductReviewsResponse {
  reviews: Review[];
  totalReviewCount?: number | null;
  /** Only sent by providers with cursor pagination; no `after` means the last page. */
  cursors?: {
    after?: string | null;
  };
}
