import {
  appDidStart$, main$,
} from '@shopgate/engage/core';
import { handleCookieConsent, showCookieConsentModal, updateCookieConsent } from '../action-creators';
import {
  getAreComfortCookiesActive,
  getAreStatisticsCookiesActive,
  getIsCookieConsentHandled,
} from '../selectors';
import { appConfig } from '../../index';
import { COOKIE_CONSENT_HANDLED } from '../constants';

/**
 * stream which gets triggered when the cookie consent has been handled by the user.
 * @type {Observable}
 */
export const cookieConsentHandled$ = main$.filter(({ action }) => (
  action.type === COOKIE_CONSENT_HANDLED
));

/**
 * show cookie consent modal at first app start
 * @param {Function} subscribe The subscribe function
 */
export default function cookieConsent(subscribe) {
  subscribe(appDidStart$, ({ dispatch, getState }) => {
    const { cookieConsent: { cookieConsentActivated } } = appConfig;
    const isCookieConsentHandled = getIsCookieConsentHandled(getState());
    const areStatisticsCookiesActive = getAreStatisticsCookiesActive(getState());
    const areComfortCookiesActive = getAreComfortCookiesActive(getState());

    // if merchant has not activated the cookie feature:
    // trigger stream to continue with push opt-in modal
    if (!cookieConsentActivated) {
      dispatch(updateCookieConsent({
        areComfortCookiesActive: null,
        areStatisticsCookiesActive: null,
      }));
    }

    // if merchant has activated cookie feature but user has not chosen cookies yet:
    // show cookie consent modal to make user choose them
    if (cookieConsentActivated && !isCookieConsentHandled) {
      dispatch(showCookieConsentModal());
    }

    // if merchant has activated cookie feature and user has chosen cookies already
    // trigger stream to continue with push opt-in modal
    if (cookieConsentActivated && isCookieConsentHandled) {
      dispatch(updateCookieConsent({
        areComfortCookiesActive,
        areStatisticsCookiesActive,
      }));
    }
  });

  subscribe(cookieConsentHandled$, ({ dispatch, action }) => {
    dispatch(handleCookieConsent({
      areComfortCookiesActive: action.areComfortCookiesActive,
      areStatisticsCookiesActive: action.areStatisticsCookiesActive,
    }));
  });
}
