import {
  withScope,
  captureMessage,
  Severity as SentrySeverity,
} from '@sentry/browser';
import appConfig from '@shopgate/pwa-common/helpers/config';
import {
  receiveShopSettings,
  errorShopSettings,
} from '@shopgate/engage/settings/action-creators/shopSettings';
import { receiveMerchantSettings } from '@shopgate/engage/settings/action-creators/merchantSettings';
import { receiveAppSettings } from '@shopgate/engage/settings/action-creators/appSettings';
import type { AppSettingsPayload } from '@shopgate/engage/settings/types/appSettings';

const REQUEST_TIMEOUT = 3000;

/**
 * The payload types the settings action creators declare. Derived rather than written out,
 * because shopSettings and merchantSettings are untyped JS whose JSDoc describes their payload
 * as `{Array}` / `{Object}` whereas the JSONP files actually send a settings object. Deriving
 * keeps this file honest about the mismatch and picks up the real types once that JSDoc is fixed.
 */
type ShopSettingsPayload = Parameters<typeof receiveShopSettings>[0];
type ShopSettingsError = Parameters<typeof errorShopSettings>[0];
type MerchantSettingsPayload = Parameters<typeof receiveMerchantSettings>[0];

interface SettingsStore {
  dispatch: (action: unknown) => void;
}

interface SettingsUrls {
  settingsUrl?: string | null;
  merchantSettingsUrl?: string | null;
  appSettingsUrl?: string | null;
}

interface LoadJsonpSettingsParams {
  /**
   * Id of the injected script tag.
   */
  id: string;
  /**
   * Url of the JSONP file.
   */
  url: string;
  /**
   * Name of the global callback the JSONP file invokes.
   */
  callbackName: string;
  /**
   * Invoked with the settings payload when the JSONP file called back. The payload arrives
   * from a remote file, so it is unknown until a consumer narrows it.
   */
  onReceive: (settings: unknown) => void;
  /**
   * Invoked with the script error event when the script failed to load.
   */
  onError?: (error: unknown) => void;
}

/**
 * Injects a script tag to fetch a settings JSONP.
 * @param id The script id.
 * @param src The script url.
 * @param onError Callback for error situations.
 */
const injectScript = (id: string, src: string, onError: (error: unknown) => void) => {
  const existingTag = document.querySelector(`#${id}`);

  if (existingTag) {
    existingTag.remove();
  }

  const scriptTag = document.createElement('script');
  scriptTag.setAttribute('src', src);
  scriptTag.setAttribute('id', id);
  scriptTag.onerror = onError;
  document.head.appendChild(scriptTag);
};

/**
 * Loads a single JSONP settings source. Resolves when the payload arrived, when the script
 * failed to load, or when REQUEST_TIMEOUT elapsed - it never rejects, so that no single
 * source can block or delay app start indefinitely.
 * @param params The loader params.
 * @returns A promise that resolves once the source settled.
 */
const loadJsonpSettings = (params: LoadJsonpSettingsParams): Promise<void> =>
  new Promise((resolve) => {
    const {
      id,
      url,
      callbackName,
      onReceive,
      onError,
    } = params;

    let settled = false;
    let timeout: ReturnType<typeof setTimeout>;

    /**
     * Resolves the promise once, whichever of payload / error / timeout comes first.
     */
    const settle = () => {
      if (settled) {
        return;
      }

      settled = true;
      clearTimeout(timeout);
      resolve();
    };

    // Started before the callback and the script are wired up, so that a synchronously firing
    // callback / error (e.g. a data: url) settles against an already assigned timeout - otherwise
    // clearTimeout would no-op and this timer would still fire a false timeout warning.
    timeout = setTimeout(() => {
      withScope((scope) => {
        scope.setLevel(SentrySeverity.Warning);
        scope.setExtra('settingsUrl', url);
        scope.setExtra('timeout', REQUEST_TIMEOUT);
        captureMessage(`Fetching settings took too long: ${id}`);
      });

      settle();
    }, REQUEST_TIMEOUT);

    // Registered before the script is injected, since the JSONP files guard their call with
    // `window.setX && window.setX(...)` - a callback assigned too late is a silent no-op.
    // Deliberately never removed: the timeout may settle while the script is still in flight,
    // and a payload arriving after that should still hydrate the store.
    (window as unknown as Record<string, unknown>)[callbackName] = (settings: unknown) => {
      onReceive(settings);
      settle();
    };

    injectScript(id, url, (error) => {
      withScope((scope) => {
        scope.setLevel(SentrySeverity.Error);
        scope.setExtra('settingsUrl', url);
        captureMessage(`Fetching settings failed: ${id}`);
      });

      onError?.(error);
      settle();
    });
  });

/**
 * Fetches all configured JSONP settings sources in parallel. Sources without a configured url
 * are skipped. Never rejects - every source falls back to the defaults of its reducer.
 * @param store Reference to the store.
 * @returns A promise that resolves once all configured sources settled.
 */
export const fetchSettings = async (store: SettingsStore): Promise<void> => {
  const {
    settingsUrl,
    merchantSettingsUrl,
    appSettingsUrl,
  } = appConfig as SettingsUrls;

  const loaders: Array<Promise<void>> = [];

  if (settingsUrl) {
    loaders.push(loadJsonpSettings({
      id: 'shop-settings-jsonp',
      url: settingsUrl,
      callbackName: 'setShopSettings',
      onReceive: settings => store.dispatch(
        receiveShopSettings(settings as ShopSettingsPayload)
      ),
      onError: error => store.dispatch(errorShopSettings(error as ShopSettingsError)),
    }));
  }

  if (merchantSettingsUrl) {
    loaders.push(loadJsonpSettings({
      id: 'merchant-settings-jsonp',
      url: merchantSettingsUrl,
      callbackName: 'setMerchantSettings',
      onReceive: settings => store.dispatch(
        receiveMerchantSettings(settings as MerchantSettingsPayload)
      ),
    }));
  }

  if (appSettingsUrl) {
    loaders.push(loadJsonpSettings({
      id: 'app-settings-jsonp',
      url: appSettingsUrl,
      callbackName: 'setAppSettings',
      onReceive: settings => store.dispatch(receiveAppSettings(settings as AppSettingsPayload)),
    }));
  }

  await Promise.all(loaders);
};
