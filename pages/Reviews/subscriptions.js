import setTitle from '@shopgate/pwa-common/actions/view/setTitle';
import { hex2bin } from '@shopgate/pwa-common/helpers/data';
import fetchReviews from '@shopgate/pwa-common-commerce/reviews/actions/fetchReviews';
import { reviewsWillEnter$, reviewsWillLeave$ } from '@shopgate/pwa-common-commerce/reviews/streams';
import disableNavigatorSearch from 'Components/Navigator/actions/disableNavigatorSearch';
import enableNavigatorSearch from 'Components/Navigator/actions/enableNavigatorSearch';
import { REVIEW_ITEMS_PER_PAGE } from './constants';

/**
 * @param {Function} subscribe The subscribe function.
 */
export default function reviews(subscribe) {
  subscribe(reviewsWillEnter$, ({ dispatch, action }) => {
    dispatch(setTitle('titles.reviews'));

    dispatch(disableNavigatorSearch());
    dispatch(fetchReviews(hex2bin(action.route.params.productId), REVIEW_ITEMS_PER_PAGE));
  });

  subscribe(reviewsWillLeave$, ({ dispatch }) => {
    dispatch(enableNavigatorSearch());
  });
}
