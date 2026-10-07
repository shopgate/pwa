// PRODUCT REVIEWS LIST
export const REVIEWS_LIFETIME = 900000; // 15 minutes
export const REQUEST_REVIEWS = 'REQUEST_REVIEWS';
export const RECEIVE_REVIEWS = 'RECEIVE_REVIEWS';
export const ERROR_REVIEWS = 'ERROR_REVIEWS';

// PRODUCT REVIEWS
export const REQUEST_PRODUCT_REVIEWS = 'REQUEST_PRODUCT_REVIEWS';
export const RECEIVE_PRODUCT_REVIEWS = 'RECEIVE_PRODUCT_REVIEWS';
export const ERROR_PRODUCT_REVIEWS = 'ERROR_PRODUCT_REVIEWS';

// USER REVIEW
export const USER_REVIEW_LIFETIME = 300000; // 5 minutes
export const REQUEST_USER_REVIEW = 'REQUEST_USER_REVIEW';
export const RECEIVE_USER_REVIEW = 'RECEIVE_USER_REVIEW';
export const ERROR_USER_REVIEW = 'ERROR_USER_REVIEW';
export const FLUSH_USER_REVIEWS = 'FLUSH_USER_REVIEWS';

// SUBMIT REVIEW
export const REQUEST_SUBMIT_REVIEW = 'REQUEST_SUBMIT_REVIEW';
export const RECEIVE_SUBMIT_REVIEW = 'RECEIVE_SUBMIT_REVIEW';
export const ERROR_SUBMIT_REVIEW = 'ERROR_SUBMIT_REVIEW';
export const RESET_SUBMIT_REVIEW = 'RESET_SUBMIT_REVIEW';

// REVIEW RATE
export const RECEIVE_REVIEW_RATE = 'RECEIVE_REVIEW_RATE';
export const REVIEW_FEATURE_RATE = 'reviewRate';

// REVIEW SUMMARY
export const REVIEW_FEATURE_RATING_SUMMARY = 'ratingSummary';

// REVIEW LIST QUERY
/**
 * The list filters the PWA knows: the capability a provider reports in its settings, the
 * request parameter that activates the filter, the kind of its control and the label.
 * A toggle is sent as `true`, the rate filter as the number of stars from 1 to 5.
 */
export const REVIEW_FILTERS = [
  {
    feature: 'mediaFilter',
    param: 'filterMedia',
    type: 'toggle',
    label: 'reviews.filter_media',
  },
  {
    feature: 'verifiedFilter',
    param: 'filterVerified',
    type: 'toggle',
    label: 'reviews.filter_verified',
  },
  {
    feature: 'rateFilter',
    param: 'filterRate',
    type: 'rate',
    label: 'reviews.filter_rate_all',
  },
];
export const REVIEW_SORT_OPTIONS = ['relevance', 'dateDesc', 'dateAsc', 'rateDesc', 'rateAsc'];

// PRODUCT REVIEW SETTINGS
export const REVIEW_SETTINGS_LIFETIME = 60 * 60 * 1000;
export const REQUEST_PRODUCT_REVIEW_SETTINGS = 'REQUEST_PRODUCT_REVIEW_SETTINGS';
export const RECEIVE_PRODUCT_REVIEW_SETTINGS = 'RECEIVE_PRODUCT_REVIEW_SETTINGS';
export const ERROR_PRODUCT_REVIEW_SETTINGS = 'ERROR_PRODUCT_REVIEW_SETTINGS';
export const PAGINATION_TYPE_OFFSET = 'offset';
export const PAGINATION_TYPE_CURSOR = 'cursor';

/**
 * Max number of reviews shown
 * @type {number}
 */
export const REVIEW_PREVIEW_COUNT = 2;

/**
 * Number of reviews loaded per request on the full review page.
 * @type {number}
 */
export const REVIEW_ITEMS_PER_PAGE = 10;
