import { withScope, captureMessage } from '@sentry/browser';
import { RECEIVE_APP_SETTINGS } from '@shopgate/engage/settings/constants/appSettings';
import { getReferrerOrigin, isFrontendSettingsAdminPreviewActive } from '../helpers';
import { PREVIEW_STYLE_TAG_ID } from '../components/FrontendSettingsPreviewBridge/helpers';
import type { FrontendSettingsPreviewBridgeMessage } from '../components/FrontendSettingsPreviewBridge/types';
import { awaitInitialFrontendSettings } from './awaitInitialFrontendSettings';
import {
  getInitialFrontendSettingsStyling,
  hasInitialFrontendSettings,
  resetInitialFrontendSettings,
} from './_internal/initialFrontendSettings';

jest.mock('../helpers', () => ({
  ...jest.requireActual('../helpers'),
  isFrontendSettingsAdminPreviewActive: jest.fn(() => true),
  getReferrerOrigin: jest.fn(() => 'https://admin-mono.shopgate.com'),
}));

jest.mock('@sentry/browser', () => ({
  withScope: jest.fn(),
  captureMessage: jest.fn(),
  Severity: {
    Error: 'error',
    Warning: 'warning',
  },
}));

const REQUEST_TIMEOUT = 3000;
const ALLOWED_ORIGIN = 'https://admin-mono.shopgate.com';

const dispatch = jest.fn();
const store = { dispatch };

/**
 * Delivers a message to the listener awaitInitialFrontendSettings registered. jsdom does not let a
 * test set `origin` or `source` on a real postMessage, so the event is constructed and dispatched
 * directly.
 * @param data The message payload.
 * @param options Overrides for the two fields the origin guard checks.
 * @param options.origin The origin the event claims to come from.
 * @param options.source The window the event claims to come from.
 */
const deliver = (
  data: unknown,
  options: { origin?: string; source?: unknown } = {}
) => {
  const { origin = ALLOWED_ORIGIN, source = window.parent } = options;
  const event = new MessageEvent('message', { data });

  Object.defineProperty(event, 'origin', { value: origin });
  Object.defineProperty(event, 'source', { value: source });

  window.dispatchEvent(event);
};

const settings: FrontendSettingsPreviewBridgeMessage = {
  type: 'receiveFrontendSettings',
  payload: {
    styling: { '.button': { backgroundColor: 'red' } },
  },
};

describe('engage > admin-preview > awaitInitialFrontendSettings', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    document.head.innerHTML = '';
    resetInitialFrontendSettings();
    (isFrontendSettingsAdminPreviewActive as jest.Mock).mockReturnValue(true);

    // withScope only configures the Sentry scope, so a stub scope is enough to let the callback
    // run and reach captureMessage.
    (withScope as jest.Mock).mockImplementation((callback: (scope: unknown) => void) => {
      callback({
        setLevel: jest.fn(),
        setExtra: jest.fn(),
      });
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('outside the preview', () => {
    beforeEach(() => {
      (isFrontendSettingsAdminPreviewActive as jest.Mock).mockReturnValue(false);
    });

    it('should resolve without announcing anything', async () => {
      const postMessage = jest.spyOn(window.parent, 'postMessage');

      await expect(awaitInitialFrontendSettings(store)).resolves.toBeUndefined();

      expect(postMessage).not.toHaveBeenCalled();
      expect(hasInitialFrontendSettings()).toBe(false);
    });
  });

  describe('in the preview', () => {
    it('should announce readiness to the embedding admin', () => {
      const postMessage = jest.spyOn(window.parent, 'postMessage');

      awaitInitialFrontendSettings(store);

      expect(postMessage).toHaveBeenCalledTimes(1);
      expect(postMessage).toHaveBeenCalledWith(
        { type: 'frontendSettingsPreviewReady' },
        ALLOWED_ORIGIN
      );
    });

    it('should not announce readiness to a foreign embedder', () => {
      (getReferrerOrigin as jest.Mock).mockReturnValueOnce('https://attacker.example');
      const postMessage = jest.spyOn(window.parent, 'postMessage');

      awaitInitialFrontendSettings(store);

      expect(postMessage).not.toHaveBeenCalled();
    });

    it('should not announce readiness without a known embedder', () => {
      (getReferrerOrigin as jest.Mock).mockReturnValueOnce(null);
      const postMessage = jest.spyOn(window.parent, 'postMessage');

      awaitInitialFrontendSettings(store);

      expect(postMessage).not.toHaveBeenCalled();
    });

    it('should apply the received styling before it resolves', async () => {
      const promise = awaitInitialFrontendSettings(store);

      deliver(settings);

      await expect(promise).resolves.toBeUndefined();
      expect(document.getElementById(PREVIEW_STYLE_TAG_ID)?.textContent)
        .toBe('.button { background-color: red; }');
    });

    it('should dispatch the received app settings', async () => {
      const promise = awaitInitialFrontendSettings(store);
      const appSettings = { images: { quality: 42 } };

      deliver({
        type: 'receiveFrontendSettings',
        payload: { appSettings },
      });

      await promise;

      expect(dispatch).toHaveBeenCalledWith({
        type: RECEIVE_APP_SETTINGS,
        settings: appSettings,
      });
    });

    it('should hand the styling over to the bridge', async () => {
      const promise = awaitInitialFrontendSettings(store);

      deliver(settings);
      await promise;

      expect(hasInitialFrontendSettings()).toBe(true);
      expect(getInitialFrontendSettingsStyling()).toEqual({
        '.button': { backgroundColor: 'red' },
      });
    });

    it('should record a payload without styling, so the bridge still reports it applied', async () => {
      const promise = awaitInitialFrontendSettings(store);

      deliver({
        type: 'receiveFrontendSettings',
        payload: {},
      });
      await promise;

      expect(hasInitialFrontendSettings()).toBe(true);
      expect(getInitialFrontendSettingsStyling()).toBeNull();
      expect(document.getElementById(PREVIEW_STYLE_TAG_ID)).toBeNull();
    });

    it('should ignore a message from a disallowed origin', () => {
      awaitInitialFrontendSettings(store);

      deliver(settings, { origin: 'https://evil.example.com' });

      expect(hasInitialFrontendSettings()).toBe(false);
      expect(document.getElementById(PREVIEW_STYLE_TAG_ID)).toBeNull();
    });

    it('should ignore a message that did not come from the parent window', () => {
      awaitInitialFrontendSettings(store);

      deliver(settings, { source: {} });

      expect(hasInitialFrontendSettings()).toBe(false);
      expect(document.getElementById(PREVIEW_STYLE_TAG_ID)).toBeNull();
    });

    it('should ignore other message types', () => {
      awaitInitialFrontendSettings(store);

      deliver({
        type: 'setColorScheme',
        payload: { colorScheme: 'dark' },
      });

      expect(hasInitialFrontendSettings()).toBe(false);
    });

    it('should resolve and report to Sentry when no payload arrives', async () => {
      const promise = awaitInitialFrontendSettings(store);

      jest.advanceTimersByTime(REQUEST_TIMEOUT);

      await expect(promise).resolves.toBeUndefined();
      expect(captureMessage)
        .toHaveBeenCalledWith('Waiting for the initial frontend settings took too long');
      expect(hasInitialFrontendSettings()).toBe(false);
    });

    it('should not report a timeout after a payload arrived', async () => {
      const promise = awaitInitialFrontendSettings(store);

      deliver(settings);
      await promise;

      jest.advanceTimersByTime(REQUEST_TIMEOUT);

      expect(captureMessage).not.toHaveBeenCalled();
    });

    it('should stop listening once it settled, leaving the bridge in charge', async () => {
      const promise = awaitInitialFrontendSettings(store);

      deliver(settings);
      await promise;

      deliver({
        type: 'receiveFrontendSettings',
        payload: { styling: { '.button': { backgroundColor: 'blue' } } },
      });

      expect(document.getElementById(PREVIEW_STYLE_TAG_ID)?.textContent)
        .toBe('.button { background-color: red; }');
    });
  });
});
