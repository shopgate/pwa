import { appDidStart$ } from '@shopgate/engage/core';
import { isTrackingAllowed } from '../helpers';
import { hasCookieConsent } from '../selectors';
import { initTracking } from '../action-creators';

/**
 * Orders subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
const tracking = (subscribe) => {
  subscribe(appDidStart$, ({ getState, dispatch }) => {
    const hasConsent = hasCookieConsent(getState());

    if (!hasConsent || isTrackingAllowed()) {
      dispatch(initTracking());
    }
  });
};

export default tracking;
