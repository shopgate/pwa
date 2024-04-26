import {
  appDidStart$, main$,
} from '@shopgate/engage/core';
import { handleCookieConsent, showCookieConsentModal, updateCookieConsent } from '../action-creators';
import {
  getIsCookieConsentHandled,
} from '../selectors';
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
}
