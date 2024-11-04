import {
  softOptInShown$,
  softOptInSelected$,
  hardOptInShown$,
  hardOptInSelected$,
} from '@shopgate/engage/core/streams';
import { track } from '@shopgate/engage/tracking/helpers';

import {
  reloadApp,
} from '@shopgate/engage/core/action-creators';
import {
  appSupportsCookieConsent,
  hasSGJavaScriptBridge,
} from '@shopgate/engage/core/helpers';
import {
  analyticsSetConsent,
} from '@shopgate/engage/core/commands';
import {
  cookieConsentInitialized$,
  cookieConsentUpdated$,
} from '../streams';

const softTrackingOptInShown$ = softOptInShown$
  .filter(({ action }) => action?.meta?.permission === 'tracking');

const softTrackingOptInSelected$ = softOptInSelected$
  .filter(({ action }) => action?.meta?.permission === 'tracking');

const hardTrackingOptInShown$ = hardOptInShown$
  .filter(({ action }) => action?.meta?.permission === 'tracking');

const hardTrackingOptInSelected$ = hardOptInSelected$
  .filter(({ action }) => action?.meta?.permission === 'tracking');

/**
 * Analytics subscriptions
 * @param {Function} subscribe The subscribe function
 */
export default function analytics(subscribe) {
  /**
   * Sends cookie consent decisions to the app
   * @param {Object} params Function params
   * @param {Object} params.action Cookie consent update action
   */
  const sendConsentToApp = async ({ action }) => {
    if (!appSupportsCookieConsent() || !hasSGJavaScriptBridge()) {
      // Not worth to dispatch commands to an app that doesn't support them.
      // Within browser do not block process while waiting for an app response that will never come.
      return;
    }

    const { statisticsCookiesAccepted, comfortCookiesAccepted } = action;

    // Send consent decisions to the app
    await analyticsSetConsent({
      statistics: statisticsCookiesAccepted,
      comfort: comfortCookiesAccepted,
    });
  };

  subscribe(cookieConsentInitialized$, async ({ action }) => {
    await sendConsentToApp({ action });
  });

  subscribe(cookieConsentUpdated$, async ({ dispatch, action }) => {
    await sendConsentToApp({ action });

    // The PWA is reloaded whenever cookie consent settings changed to guarantee that all trackers
    // are turned off
    dispatch(reloadApp());
  });

  subscribe(softTrackingOptInShown$, ({ getState }) => {
    track('customEvent', {
      eventCategory: 'softTrackingOptIn',
      eventAction: 'shown',
      label: null,
      additionalEventParams: {
        eventName: 'softTrackingOptInShown',
      },
    }, getState());
  });

  subscribe(softTrackingOptInSelected$, ({ action, getState }) => {
    const { selection, meta: { permission, ...meta } } = action;

    track('customEvent', {
      eventCategory: 'softTrackingOptIn',
      eventAction: 'decision',
      label: selection,
      additionalEventParams: {
        eventName: 'softTrackingOptInSelected',
        selection,
        ...meta,
      },
    }, getState());
  });

  subscribe(hardTrackingOptInShown$, ({ action, getState }) => {
    const { meta: { permission, ...meta } } = action;

    track('customEvent', {
      eventCategory: 'hardTrackingOptIn',
      eventAction: 'shown',
      label: null,
      additionalEventParams: {
        eventName: 'hardTrackingOptInShown',
        ...meta,
      },
    }, getState());
  });

  subscribe(hardTrackingOptInSelected$, ({ action, getState }) => {
    const { selection, meta: { permission, ...meta } } = action;

    track('customEvent', {
      eventCategory: 'hardTrackingOptIn',
      eventAction: 'decision',
      label: selection,
      additionalEventParams: {
        eventName: 'hardTrackingOptInSelected',
        selection,
        ...meta,
      },
    }, getState());
  });
}
