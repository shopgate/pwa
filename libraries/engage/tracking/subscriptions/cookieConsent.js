import { main$, appDidStart$ } from '@shopgate/engage/core/streams';
import { ROUTE_WILL_LEAVE } from '@shopgate/engage/core/constants';
import { PRIVACY_SETTINGS_PATTERN } from '@shopgate/engage/tracking/constants';
import { handleCookieConsent, showCookieConsentModal } from '../action-creators';
import {
  getIsCookieConsentHandled,
  getAreComfortCookiesSet,
  getAreStatisticsCookiesSet,
} from '../selectors/cookieConsent';
import { appConfig } from '../../index';

/**
 * stream which gets triggered when the user navigates back from privacy settings page
 * and cookie consent modal needs to be shown again.
 * @type {Observable}
 */
export const navigateBackToCookieModal$ = main$
  .filter(({ action }) => (action.type === ROUTE_WILL_LEAVE))
  .filter(({ action }) => action.route.pathname === PRIVACY_SETTINGS_PATTERN);

/**
 * determine whether to show the cookie consent modal at app start
 * @param {Function} subscribe The subscribe function
 */
export default function cookieConsent(subscribe) {
  subscribe(appDidStart$, ({ dispatch, getState }) => {
    const state = getState();
    const { cookieConsent: { isCookieConsentActivated } } = appConfig;
    const isCookieConsentHandled = getIsCookieConsentHandled(state);

    /**
     * if merchant has not activated the cookie feature OR if merchant has activated cookie feature
     * and user has chosen cookies already trigger stream to run code that depends on the cookie
     * consent.
     */
    if (!isCookieConsentActivated || (isCookieConsentActivated && isCookieConsentHandled)) {
      const areComfortCookiesActive = getAreComfortCookiesSet(state);
      const areStatisticsCookiesActive = getAreStatisticsCookiesSet(state);

      dispatch(handleCookieConsent({
        areComfortCookiesActive,
        areStatisticsCookiesActive,
      }));

      return;
    }

    // if merchant has activated cookie feature but user has not chosen cookies yet:
    // show cookie consent modal to make user choose them
    if (isCookieConsentActivated && !isCookieConsentHandled) {
      dispatch(showCookieConsentModal());
    }
  });

  subscribe(navigateBackToCookieModal$, ({ dispatch, getState }) => {
    const { cookieConsent: { isCookieConsentActivated } } = appConfig;
    const isCookieConsentHandled = getIsCookieConsentHandled(getState());
    if (isCookieConsentActivated && !isCookieConsentHandled) {
      dispatch(showCookieConsentModal());
    }
  });
}
