import { getCurrentRoute } from '@shopgate/pwa-common/helpers/router';
import { main$ } from '@shopgate/pwa-common/streams/main';
import { routeWillEnter$, routeWillLeave$ } from '@shopgate/pwa-common/streams/router';
import {
  ITEM_PATH,
  RECEIVE_PRODUCT,
  RECEIVE_PRODUCT_CACHED,
} from '@shopgate/pwa-common-commerce/product/constants';
import {
  REQUEST_SUBMIT_REVIEW,
  RECEIVE_SUBMIT_REVIEW,
  ERROR_SUBMIT_REVIEW,
  RESET_SUBMIT_REVIEW,
} from '../constants';

export const reviewsWillEnter$ = routeWillEnter$
  .filter(({ action }) => action.route.pattern === `${ITEM_PATH}/:productId/reviews`);

export const reviewsWillLeave$ = routeWillLeave$
  .filter(({ action }) => action.route.pattern === `${ITEM_PATH}/:productId/reviews`);

/**
 * Gets triggered when the user tried to submit a review.
 * @type {Observable}
 */
export const requestReviewSubmit$ = main$.filter(({ action }) => (
  action.type === REQUEST_SUBMIT_REVIEW
));

/**
 * Gets triggered when the user tried to submit a review.
 * @type {Observable}
 */
export const responseReviewSubmit$ = main$.filter(({ action }) => (
  [RECEIVE_SUBMIT_REVIEW, ERROR_SUBMIT_REVIEW, RESET_SUBMIT_REVIEW].includes(action.type)
));

/**
 * Gets triggered when the user submit was successful.
 * @type {Observable}
 */
export const successReviewSubmit$ = main$.filter(({ action }) => (
  action.type === RECEIVE_SUBMIT_REVIEW
));

/**
 * Gets triggered when the user submit was not successful.
 * @type {Observable}
 */
export const errorReviewSubmit$ = main$.filter(({ action }) => (
  [ERROR_SUBMIT_REVIEW, RESET_SUBMIT_REVIEW].includes(action.type)
));

export const shouldFetchReviews$ = main$
  .filter(({ action }) => (
    action.type === RECEIVE_PRODUCT || action.type === RECEIVE_PRODUCT_CACHED
  ))
  .merge(successReviewSubmit$);
