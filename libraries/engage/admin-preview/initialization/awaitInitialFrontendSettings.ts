import {
  withScope,
  captureMessage,
  Severity as SentrySeverity,
} from '@sentry/browser';
import { receiveAppSettings } from '@shopgate/engage/settings/action-creators/appSettings';
import {
  getReferrerOrigin,
  isAllowedOrigin,
  isFrontendSettingsAdminPreviewActive,
} from '../helpers';
import { ALLOWED_ADMIN_PREVIEW_ORIGINS } from '../constants';
import {
  getOrCreateStyleTag,
  serializeStyling,
} from '../components/FrontendSettingsPreviewBridge/helpers';
import type {
  FrontendSettingsPreviewBridgeMessage,
} from '../components/FrontendSettingsPreviewBridge/types';
import { setInitialFrontendSettings } from './_internal/initialFrontendSettings';

const REQUEST_TIMEOUT = 3000;

interface PreviewStore {
  dispatch: (action: unknown) => void;
}

/**
 * Waits for the first settings message from the admin and applies it before the app renders.
 *
 * Without this the app paints with the theme defaults first: the bridge that owns the message
 * listener only mounts once React committed, so everything the admin sent before that is dropped
 * and the styling arrives as a visible restyle.
 *
 * The handshake goes to the origin of the embedding document. Nothing has been received at this
 * point, so that referrer is the only concrete parent origin available - the allow list holds
 * patterns, and a pattern is no valid postMessage target. An admin that strips its referrer
 * therefore gets no ready message, and the app falls back to the timeout below.
 *
 * Resolves when the payload arrived or when REQUEST_TIMEOUT elapsed, and never rejects - an admin
 * that stays silent has to fall back to the unstyled app, never to an iframe that never renders.
 * @param store Reference to the store.
 * @returns A promise that resolves once the first payload settled.
 */
export const awaitInitialFrontendSettings = (store: PreviewStore): Promise<void> =>
  new Promise((resolve) => {
    if (!isFrontendSettingsAdminPreviewActive()) {
      resolve();
      return;
    }

    let settled = false;
    let timeout: ReturnType<typeof setTimeout>;

    /**
     * Resolves the promise once, whichever of payload / timeout comes first, and stops listening.
     * The bridge attaches its own listener when it mounts and re-sends the handshake, so the admin
     * resyncs from there.
     */
    const settle = () => {
      if (settled) {
        return;
      }

      settled = true;
      clearTimeout(timeout);
      window.removeEventListener('message', handleMessage);
      resolve();
    };

    /**
     * Handles the first trusted message. A function declaration, so `settle` can detach it again
     * without a forward reference.
     * @param event The message event.
     */
    function handleMessage(event: MessageEvent<FrontendSettingsPreviewBridgeMessage>) {
      if (!isAllowedOrigin(event.origin, ALLOWED_ADMIN_PREVIEW_ORIGINS)) return;
      if (event.source !== window.parent) return;

      const { data } = event;

      if (data?.type !== 'receiveFrontendSettings') return;

      const styling = data.payload?.styling ?? null;

      if (styling) {
        getOrCreateStyleTag().textContent = serializeStyling(styling);
      }

      if (data.payload?.appSettings) {
        store.dispatch(receiveAppSettings(data.payload.appSettings));
      }

      setInitialFrontendSettings(styling);

      settle();
    }

    window.addEventListener('message', handleMessage);

    timeout = setTimeout(() => {
      withScope((scope) => {
        scope.setLevel(SentrySeverity.Warning);
        scope.setExtra('timeout', REQUEST_TIMEOUT);
        captureMessage('Waiting for the initial frontend settings took too long');
      });

      settle();
    }, REQUEST_TIMEOUT);

    // Allowed origins can be patterns, which are no valid postMessage targets, so the ready
    // message goes to the document that embedded us - as long as it is an allowed origin.
    const parentOrigin = getReferrerOrigin();

    if (isAllowedOrigin(parentOrigin, ALLOWED_ADMIN_PREVIEW_ORIGINS)) {
      window.parent.postMessage({ type: 'frontendSettingsPreviewReady' }, parentOrigin);
    }
  });
