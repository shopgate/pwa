import {
  appDidStart$,
} from '@shopgate/engage/core';
import { showCookieConsentModal } from '../action-creators';

/**
 * show cookie consent modal at first app start
 * @param {Function} subscribe The subscribe function
 */
export default function cookieConsent(subscribe) {
  subscribe(appDidStart$, async ({ dispatch }) => {
    dispatch(showCookieConsentModal());
  });
}
