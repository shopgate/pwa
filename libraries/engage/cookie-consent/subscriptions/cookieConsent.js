import {
  appDidStart$,
} from '@shopgate/engage/core';
import { finishCookiesConsent, showCookieConsentModal } from '../action-creators';
import { getAreComfortCookiesSelected, getAreStatisticsCookiesSelected, getIsCookieConsentHandled } from '../selectors';
import { appConfig } from '../../index';
import { comfortCookieActivated$, statisticsCookiesActivated$ } from '../streams';

/**
 * show cookie consent modal at first app start
 * @param {Function} subscribe The subscribe function
 */
export default function cookieConsent(subscribe) {
  subscribe(appDidStart$, async ({ dispatch, getState }) => {
    const { cookieConsent: { cookieConsentActivated } } = appConfig;
    const isCookieConsentHandled = getIsCookieConsentHandled(getState());
    const areStatisticsCookiesSelected = getAreStatisticsCookiesSelected(getState());
    const areComfortCookiesSelected = getAreComfortCookiesSelected(getState());

    // if merchant has not activated the cookie feature:
    // trigger stream to continue with push opt-in modal
    if (!cookieConsentActivated) {
      dispatch(finishCookiesConsent({
        areComfortCookiesSelected: null,
        areStatisticsCookiesSelected: null,
      }));
    }

    // if merchant has activated cookie feature but user has not chosen cookies yet:
    // show cookie consent modal to make user choose them
    if (cookieConsentActivated && !isCookieConsentHandled) {
      await dispatch(showCookieConsentModal());
    }

    // if merchant has activated cookie feature and user has chosen cookies already
    // trigger stream to continue with push opt-in modal
    if (cookieConsentActivated && isCookieConsentHandled) {
      dispatch(finishCookiesConsent({
        areComfortCookiesSelected,
        areStatisticsCookiesSelected,
      }));
    }
  });

  subscribe(comfortCookieActivated$, async () => {
    // comfort cookie tracking
  });

  subscribe(statisticsCookiesActivated$, async () => {
    // statistics cookie tracking
  });
}
