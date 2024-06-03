import { reloadApp } from '@shopgate/engage/core/action-creators';
import { analyticsSetConsent } from '@shopgate/engage/core/commands';
import {
  cookieConsentInitialized$,
  cookieConsentUpdated$,
} from '../streams';

/**
 * Analytics subscriptions
 * @param {Function} subscribe The subscribe function
 */
export default function analytics(subscribe) {
  /**
   * Sends cookie consent decisions to the app
   * @param {Object} action Cookie consent update action
   */
  const sendConsentToApp = async (action) => {
    const { statisticsCookiesAccepted, comfortCookiesAccepted } = action;

    await analyticsSetConsent({
      statistics: statisticsCookiesAccepted,
      comfort: comfortCookiesAccepted,
    });
  };

  subscribe(cookieConsentInitialized$, async ({ action }) => {
    await sendConsentToApp(action);
  });

  subscribe(cookieConsentUpdated$, async ({ dispatch, action }) => {
    await sendConsentToApp(action);

    // The PWA is reloaded whenever cookie consent settings changed to guarantee that all trackers
    // are turned off
    dispatch(reloadApp());
  });
}
