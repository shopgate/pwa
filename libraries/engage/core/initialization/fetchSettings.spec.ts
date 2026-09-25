import appConfig from '@shopgate/pwa-common/helpers/config';
import { RECEIVE_SHOP_SETTINGS, ERROR_SHOP_SETTINGS } from '@shopgate/engage/settings/constants/shopSettings';
import { RECEIVE_MERCHANT_SETTINGS } from '@shopgate/engage/settings/constants/merchantSettings';
import { RECEIVE_APP_SETTINGS } from '@shopgate/engage/settings/constants/appSettings';
import { fetchSettings } from './fetchSettings';

jest.mock('@shopgate/pwa-common/helpers/config', () => ({
  __esModule: true,
  default: {},
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

// The mocked config is read inside fetchSettings, so tests can just mutate it.
const config = appConfig as {
  settingsUrl?: string | null;
  merchantSettingsUrl?: string | null;
  appSettingsUrl?: string | null;
};

const globals = window as unknown as Record<string, ((settings: unknown) => void) | undefined>;

/**
 * Invokes a JSONP callback the way the remote settings file would. Throws a descriptive error
 * when the callback was never registered, since that is the failure the tests guard against.
 * @param callbackName The name of the global callback.
 * @param settings The settings payload to pass.
 */
const callJsonp = (callbackName: string, settings: unknown) => {
  const callback = globals[callbackName];

  if (!callback) {
    throw new Error(`window.${callbackName} was not registered`);
  }

  callback(settings);
};

/**
 * Simulates a failed script load for an injected settings script.
 * @param id The id of the injected script tag.
 */
const failScript = (id: string) => {
  const script = document.querySelector<HTMLScriptElement>(`#${id}`);

  if (!script?.onerror) {
    throw new Error(`No script with id "${id}" was injected`);
  }

  script.onerror(new Event('error'));
};

describe('core / initialization / fetchSettings', () => {
  let store: { dispatch: jest.Mock };

  beforeEach(() => {
    jest.useFakeTimers();
    document.head.innerHTML = '';
    store = { dispatch: jest.fn() };

    delete config.settingsUrl;
    delete config.merchantSettingsUrl;
    delete config.appSettingsUrl;

    delete globals.setShopSettings;
    delete globals.setMerchantSettings;
    delete globals.setAppSettings;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('appSettings', () => {
    it('dispatches the payload and resolves when the jsonp calls back', async () => {
      config.appSettingsUrl = 'https://example.com/appSettings.js';
      const settings = { navigation: { tabBar: { variant: 'floating' } } };

      const promise = fetchSettings(store);
      callJsonp('setAppSettings', settings);

      await expect(promise).resolves.toBeUndefined();
      expect(store.dispatch).toHaveBeenCalledWith({
        type: RECEIVE_APP_SETTINGS,
        settings,
      });
    });

    it('resolves without dispatching when the file does not exist', async () => {
      // The app settings file is optional - a 404 must leave the reducer defaults in place
      // rather than blocking app start or dispatching an error action.
      config.settingsUrl = 'https://example.com/shopSettings.js';
      config.appSettingsUrl = 'https://example.com/missing.js';

      const promise = fetchSettings(store);
      failScript('app-settings-jsonp');
      callJsonp('setShopSettings', { some: 'setting' });

      await expect(promise).resolves.toBeUndefined();
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith({
        type: RECEIVE_SHOP_SETTINGS,
        settings: { some: 'setting' },
      });
    });

    it('registers the callback before injecting the script', () => {
      // The jsonp files guard their call with `window.setX && window.setX(...)`, so a
      // callback assigned after the script ran would be a silent no-op.
      config.appSettingsUrl = 'https://example.com/appSettings.js';

      fetchSettings(store);

      expect(typeof globals.setAppSettings).toBe('function');
    });
  });

  describe('non-blocking behaviour', () => {
    it('resolves after the timeout when a script never calls back', async () => {
      // Regression: the timeout used to only report to Sentry without settling the
      // promise, which hung app start forever.
      config.appSettingsUrl = 'https://example.com/appSettings.js';

      const promise = fetchSettings(store);
      jest.advanceTimersByTime(REQUEST_TIMEOUT);

      await expect(promise).resolves.toBeUndefined();
      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('still dispatches a payload that arrives after the timeout', async () => {
      config.appSettingsUrl = 'https://example.com/appSettings.js';

      const promise = fetchSettings(store);
      jest.advanceTimersByTime(REQUEST_TIMEOUT);
      await promise;

      expect(() => callJsonp('setAppSettings', { late: true })).not.toThrow();
      expect(store.dispatch).toHaveBeenCalledWith({
        type: RECEIVE_APP_SETTINGS,
        settings: { late: true },
      });
    });

    it('loads the other sources when settingsUrl is not configured', async () => {
      // Regression: a missing settingsUrl used to reject immediately, so merchant and
      // app settings were never fetched at all.
      config.merchantSettingsUrl = 'https://example.com/merchantSettings.js';
      config.appSettingsUrl = 'https://example.com/appSettings.js';

      const promise = fetchSettings(store);
      callJsonp('setMerchantSettings', { merchant: true });
      callJsonp('setAppSettings', { app: true });

      await expect(promise).resolves.toBeUndefined();
      expect(store.dispatch).toHaveBeenCalledWith({
        type: RECEIVE_MERCHANT_SETTINGS,
        settings: { merchant: true },
      });
      expect(store.dispatch).toHaveBeenCalledWith({
        type: RECEIVE_APP_SETTINGS,
        settings: { app: true },
      });
    });

    it('keeps the shop settings when the merchant settings fail', async () => {
      // Regression: a merchant settings error used to reject the whole promise.
      config.settingsUrl = 'https://example.com/shopSettings.js';
      config.merchantSettingsUrl = 'https://example.com/merchantSettings.js';

      const promise = fetchSettings(store);
      failScript('merchant-settings-jsonp');
      callJsonp('setShopSettings', { shop: true });

      await expect(promise).resolves.toBeUndefined();
      expect(store.dispatch).toHaveBeenCalledWith({
        type: RECEIVE_SHOP_SETTINGS,
        settings: { shop: true },
      });
    });

    it('dispatches an error action when the shop settings fail', async () => {
      config.settingsUrl = 'https://example.com/shopSettings.js';

      const promise = fetchSettings(store);
      failScript('shop-settings-jsonp');

      await expect(promise).resolves.toBeUndefined();
      expect(store.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: ERROR_SHOP_SETTINGS })
      );
    });
  });

  describe('script injection', () => {
    it('only injects scripts for configured urls', async () => {
      config.settingsUrl = 'https://example.com/shopSettings.js';

      const promise = fetchSettings(store);

      expect(document.querySelector('#shop-settings-jsonp')).not.toBeNull();
      expect(document.querySelector('#merchant-settings-jsonp')).toBeNull();
      expect(document.querySelector('#app-settings-jsonp')).toBeNull();

      callJsonp('setShopSettings', {});
      await promise;
    });

    it('resolves immediately when no url is configured', async () => {
      await expect(fetchSettings(store)).resolves.toBeUndefined();

      expect(document.head.innerHTML).toBe('');
      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });
});
