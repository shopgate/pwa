import {
  withScope,
  captureMessage,
  Severity as SentrySeverity,
} from '@sentry/browser';
import { configureStore } from '@shopgate/pwa-common/store';
import { appWillStart } from '@shopgate/pwa-common/action-creators/app';
import { i18n } from '@shopgate/engage/core';
import fetchClientInformation from '@shopgate/pwa-common/actions/client/fetchClientInformation';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { receiveShopSettings, errorShopSettings } from '../action-creators';

const { locales: { currency: currencyLocale = null } = {}, settingsUrl } = appConfig;
const REQUEST_TIMEOUT = 3000;
/**
 * Injects a script tag to fetch the shop settings JSONP.
 * @param {string} src The script url
 * @param {Function} onError Callback for error situations.
 */
const injectScript = (src, onError) => {
  const id = 'shop-settings';
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
 * Fetches shop settings
 * @param {Object} store Reference to the store
 * @returns {Promise}
 */
const fetchShopSettings = store => new Promise((resolve, reject) => {
  if (!settingsUrl) {
    reject();
    return;
  }

  let timeout;

  // Add the callback for the JSONP
  window.setShopSettings = (settings) => {
    clearTimeout(timeout);
    timeout = null;
    store.dispatch(receiveShopSettings(settings));
    resolve();
  };

  // Error handling
  injectScript(settingsUrl, (error) => {
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
  i18n.init({
    locales,
    lang: process.env.LOCALE,
    currencyLocale,
  });

  const store = configureStore(reducers, subscribers);

  store.dispatch(appWillStart(`${window.location.pathname}${window.location.search}`));
  store.dispatch(fetchClientInformation());

  try {
    await fetchShopSettings(store);
  } catch (e) {
    // Nothing to see here.
  }

  return {
    store,
  };
};
