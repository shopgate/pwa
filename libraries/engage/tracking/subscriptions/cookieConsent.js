import { appDidStart$ } from '@shopgate/engage/core/streams';
import { appSupportsCookieConsent } from '@shopgate/engage/core/helpers';
import {
  grantAppTrackingTransparencyPermission,
  historyReset,
  historyPop,
} from '@shopgate/engage/core/actions';
import {
  handleCookieConsent,
  showCookieConsentModal,
  hideCookieConsentModal,
} from '../action-creators';
import {
  getIsCookieConsentHandled,
  getAreComfortCookiesAccepted,
  getAreStatisticsCookiesAccepted,
} from '../selectors/cookieConsent';
import {
  cookieConsentInitializedByUserInternal$,
  privacySettingsConfirmedWithoutChangeInternal$,
  cookieConsentModalShouldToggleInternal$,
} from '../streams/cookieConsent';

/**
 * determine whether to show the cookie consent modal at app start
 * @param {Function} subscribe The subscribe function
 */
export default function cookieConsent(subscribe) {
  subscribe(appDidStart$, async ({ dispatch, getState }) => {
    const state = getState();
    const isCookieConsentHandled = getIsCookieConsentHandled(state);

    /**
     * if merchant has not activated the cookie feature OR if merchant has activated cookie feature
     * and user has chosen cookies already trigger stream to run code that depends on the cookie
     * consent.
     */
    if (isCookieConsentHandled) {
      const comfortCookiesAccepted = getAreComfortCookiesAccepted(state);
      const statisticsCookiesAccepted = getAreStatisticsCookiesAccepted(state);

      dispatch(handleCookieConsent({
        comfortCookiesAccepted,
        statisticsCookiesAccepted,
      }));

      if (appSupportsCookieConsent() && (comfortCookiesAccepted || statisticsCookiesAccepted)) {
        await dispatch(grantAppTrackingTransparencyPermission());
      }
    } else {
      // if merchant has activated cookie feature but user has not chosen cookies yet:
      // show cookie consent modal to make user choose them
      dispatch(showCookieConsentModal());
    }
  });

  subscribe(cookieConsentInitializedByUserInternal$, ({ dispatch }) => {
    // Reset history after consent initialization to guarantee an empty history
    dispatch(historyReset());
  });

  subscribe(privacySettingsConfirmedWithoutChangeInternal$, ({ dispatch }) => {
    // Remove privacy settings route from route stack when any button was clicked but no settings
    // where changed. When something was changed, app will reset via the "analytics" streams.
    dispatch(historyPop());
  });

  subscribe(cookieConsentModalShouldToggleInternal$, ({ dispatch, showConsentModal }) => {
    dispatch(showConsentModal ? showCookieConsentModal() : hideCookieConsentModal());
  });
}
