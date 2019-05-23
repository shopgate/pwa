import { hex2bin } from '@shopgate/engage/core';
import fetchReviews from '@shopgate/pwa-common-commerce/reviews/actions/fetchReviews';
import { reviewsWillEnter$ } from '@shopgate/engage/reviews';
import { REVIEW_ITEMS_PER_PAGE } from './constants';

/**
 * @param {Function} subscribe The subscribe function.
 */
export default function reviews(subscribe) {
  subscribe(reviewsWillEnter$, ({ dispatch, action }) => {
    dispatch(fetchReviews(hex2bin(action.route.params.productId), REVIEW_ITEMS_PER_PAGE));
  });
}
