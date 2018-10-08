import { hex2bin } from '@shopgate/pwa-common/helpers/data';
import fetchReviews from '@shopgate/pwa-common-commerce/reviews/actions/fetchReviews';
import { reviewsWillEnter$ } from '@shopgate/pwa-common-commerce/reviews/streams';
import { REVIEW_ITEMS_PER_PAGE } from './constants';

/**
 * @param {Function} subscribe The subscribe function.
 */
export default function reviews(subscribe) {
  subscribe(reviewsWillEnter$, ({ dispatch, action }) => {
    dispatch(fetchReviews(hex2bin(action.route.params.productId), REVIEW_ITEMS_PER_PAGE));
  });
}
