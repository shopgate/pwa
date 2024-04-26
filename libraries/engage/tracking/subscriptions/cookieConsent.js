import { appDidStart$, main$, ROUTE_WILL_LEAVE } from '@shopgate/engage/core';
import { PRIVACY_SETTINGS_PATTERN } from '@shopgate/engage/tracking/constants';
import { handleCookieConsent, showCookieConsentModal, updateCookieConsent } from '../action-creators';
import { getIsCookieConsentHandled } from '../selectors';
import { appConfig } from '../../index';
import { COOKIE_CONSENT_HANDLED } from '../constants';
import { cookieConsentUpdated$ } from '../streams';

/**
 * stream which gets triggered when the cookie consent has been handled by the user.
 * @type {Observable}
 */
export const cookieConsentHandled$ = main$.filter(({ action }) => (
  action.type === COOKIE_CONSENT_HANDLED
));

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
    const { cookieConsent: { isCookieConsentActivated } } = appConfig;
    const isCookieConsentHandled = getIsCookieConsentHandled(getState());

    // if merchant has not activated the cookie feature:
    // trigger stream to continue with push opt-in modal
    if (!isCookieConsentActivated) {
      dispatch(updateCookieConsent({
        areComfortCookiesActive: null,
        areStatisticsCookiesActive: null,
      }));
    }

    // if merchant has activated cookie feature but user has not chosen cookies yet:
    // show cookie consent modal to make user choose them
    if (isCookieConsentActivated && !isCookieConsentHandled) {
      dispatch(showCookieConsentModal());
    }

    // if merchant has activated cookie feature and user has chosen cookies already
    // trigger stream to continue with push opt-in modal
    if (isCookieConsentActivated && isCookieConsentHandled) {
      dispatch(handleCookieConsent());
    }
  });

  subscribe(cookieConsentUpdated$, ({ dispatch }) => {
    dispatch(handleCookieConsent());
  });

  subscribe(navigateBackToCookieModal$, ({ dispatch, getState }) => {
    const { cookieConsent: { isCookieConsentActivated } } = appConfig;
    const isCookieConsentHandled = getIsCookieConsentHandled(getState());
    if (isCookieConsentActivated && !isCookieConsentHandled) {
      dispatch(showCookieConsentModal());
    }
  });
}
