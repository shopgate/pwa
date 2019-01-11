import { historyPop } from '@shopgate/pwa-common/actions/router';
import { hex2bin } from '@shopgate/pwa-common/helpers/data';
import { userDidLogout$ } from '@shopgate/pwa-common/streams/user';
import { LoadingProvider } from '@shopgate/pwa-common/providers';
import {
  requestReviewSubmit$,
  responseReviewSubmit$,
  successReviewSubmit$,
} from '@shopgate/pwa-common-commerce/reviews/streams';
import { getCurrentRoute } from '@shopgate/pwa-common/helpers/router';
import fetchUserReview from '@shopgate/pwa-common-commerce/reviews/actions/fetchUserReview';
import flushUserReview from '@shopgate/pwa-common-commerce/reviews/actions/flushUserReview';
import ToastProvider from '@shopgate/pwa-common/providers/toast';
import { productRoutesWillEnter$ } from './streams';

/**
 * @param {Function} subscribe The subscribe function.
 */
export default function writeReview(subscribe) {
  /**
   * Gets triggered when item, reviews or write_reviews route will be entered.
   */
  subscribe(productRoutesWillEnter$, ({ action, dispatch, getState }) => {
    const state = getState();
    const { productId } = action.route.params;

    if (!productId || !state.user.login.isLoggedIn) {
      return;
    }

    dispatch(fetchUserReview(hex2bin(productId)));
  });

  /**
   * Get triggered when a review submit is requested.
   */
  subscribe(requestReviewSubmit$, () => {
    const { pathname } = getCurrentRoute();
    LoadingProvider.setLoading(pathname);
  });

  /**
   * Get triggered when a review submitted got a response.
   */
  subscribe(responseReviewSubmit$, () => {
    const { pathname } = getCurrentRoute();
    LoadingProvider.unsetLoading(pathname);
  });

  /**
   * Get triggered when a review was successfully submitted
   */
  subscribe(successReviewSubmit$, ({ dispatch, events }) => {
    dispatch(historyPop());
    events.emit(ToastProvider.ADD, {
      id: 'reviews.success_message',
      message: 'reviews.success_message',
    });
  });

  /**
   * When user is logged out reviews relation should be removed.
   */
  subscribe(userDidLogout$, ({ dispatch }) => dispatch(flushUserReview()));
}
