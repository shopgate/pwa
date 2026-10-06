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
}

/**
 * Request bookkeeping that ties a review list response to the request that caused it.
 */
export interface ReviewsRequestMeta {
  requestId?: number;
  offset?: number;
  /** Opaque sort value; extensions may pass their own format. */
  sort?: string;
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
 * The pipeline response of shopgate.catalog.getProductReviews.v1.
 */
export interface ProductReviewsResponse {
  reviews: Review[];
  totalReviewCount?: number | null;
}
