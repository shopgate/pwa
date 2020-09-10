import {
  withScope,
  captureMessage,
  Severity as SentrySeverity,
} from '@sentry/browser';
import moment from 'moment';
import { configureStore } from '@shopgate/pwa-common/store';
import { appWillStart } from '@shopgate/pwa-common/action-creators/app';
import { i18n } from '@shopgate/engage/core';
import fetchClientInformation from '@shopgate/pwa-common/actions/client/fetchClientInformation';
import appConfig from '@shopgate/pwa-common/helpers/config';
import {
  receiveShopSettings,
  receiveMerchantSettings,
  errorShopSettings,
} from '../action-creators';

const {
  locales: { currency: currencyLocale = null } = {},
  settingsUrl,
  merchantSettingsUrl,
} = appConfig;
const REQUEST_TIMEOUT = 3000;
/**
 * Injects a script tag to fetch the shop settings JSONP.
 * @param {string} id The script id
 * @param {string} src The script url
 * @param {Function} onError Callback for error situations.
 */
const injectScript = (id, src, onError) => {
  let scriptTag = document.querySelector(`#${id}`);

  if (scriptTag) {
    scriptTag.remove();
  }

  scriptTag = document.createElement('script');
  scriptTag.setAttribute('src', src);
  scriptTag.setAttribute('id', id);
  scriptTag.onerror = onError;
  document.querySelector('head').appendChild(scriptTag);
};

/**
 * Fetches settings
 * @param {Object} store Reference to the store
 * @returns {Promise}
 */
const fetchSettings = store => new Promise((resolve, reject) => {
  if (!settingsUrl) {
    reject();
    return;
  }

  let timeout;
  let merchantReceived = null;
  let shopReceived = null;

  /**
   * Evaluates if completed.
   */
  const evaluateEnd = () => {
    if ((!merchantReceived && merchantSettingsUrl) || !shopReceived) {
      return;
    }

    clearTimeout(timeout);
    timeout = null;
    resolve();
  };

  // Add the callbacks for the JSONP
  window.setShopSettings = (settings) => {
    store.dispatch(receiveShopSettings(settings));
    shopReceived = true;
    evaluateEnd();
  };
  window.setMerchantSettings = (settings) => {
    store.dispatch(receiveMerchantSettings(settings));
    merchantReceived = true;
    evaluateEnd();
  };

  // Error handling
  injectScript('shop-settings-jsonp', settingsUrl, (error) => {
    withScope((scope) => {
      scope.setLevel(SentrySeverity.Error);
      scope.setExtra('settingsUrl', settingsUrl);
      captureMessage('Fetching shop settings failed');
    });
    clearTimeout(timeout);
    timeout = null;

    store.dispatch(errorShopSettings(error));
    reject();
  });

  if (merchantSettingsUrl) {
    injectScript('merchant-settings-jsonp', merchantSettingsUrl, () => {
      withScope((scope) => {
        scope.setLevel(SentrySeverity.Error);
        scope.setExtra('settingsUrl', merchantSettingsUrl);
        captureMessage('Fetching merchant settings failed');
      });
      clearTimeout(timeout);
      timeout = null;
      reject();
    });
  }

  timeout = setTimeout(() => {
    withScope((scope) => {
      scope.setLevel(SentrySeverity.Warning);
      scope.setExtra('settingsUrl', settingsUrl);
      scope.setExtra('timeout', REQUEST_TIMEOUT);
      captureMessage('Fetching shop settings took too long');
    });
  }, REQUEST_TIMEOUT);
});

/**
 *
 * @param {Object} locales An object with locales.
 * @param {Function} reducers The reducers from the theme.
 * @param {Array} subscribers The subscribers to the streams middleware.
 */
export const initialize = async (locales, reducers, subscribers) => {
  moment.locale(process.env.LOCALE);
  i18n.init({
    locales,
    lang: process.env.LOCALE,
    currencyLocale,
  });

  const store = configureStore(reducers, subscribers);

  try {
    await fetchSettings(store);
  } catch (e) {
    // Nothing to see here.
  }

  store.dispatch(appWillStart(`${window.location.pathname}${window.location.search}`));
  store.dispatch(fetchClientInformation());

  return {
    store,
  };
};
