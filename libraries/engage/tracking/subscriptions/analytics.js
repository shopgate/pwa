import { reloadApp } from '@shopgate/engage/core/action-creators';
import { cookieConsentUpdated$ } from '../streams';

/**
 * Analytics subscriptions
 * @param {Function} subscribe The subscribe function
 */
export default function analytics(subscribe) {
  subscribe(cookieConsentUpdated$, ({ dispatch }) => {
    // The PWA is reloaded whenever cookie consent settings changed to guarantee that all trackers
    // are turned off
    dispatch(reloadApp());
  });
}
