import { appWillInit, appWillStart } from '@shopgate/pwa-common/action-creators/app';
import { appConfig } from '@shopgate/engage';
import {
  i18n,
  configureStore,
  fetchClientInformation,
} from '@shopgate/engage/core';
import { appInitialization, configuration } from '@shopgate/engage/core/collections';
import { CONFIGURATION_COLLECTION_KEY_BASE_URL } from '@shopgate/engage/core/constants';
import { getAppBaseUrl } from '@shopgate/engage/core/helpers';

const {
  locales: { currency: currencyLocale = null } = {},
} = appConfig;

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

  try {
    await store.dispatch(fetchClientInformation());
  } catch (e) {
    // Nothing to see here.
  }

  // Save the base url inside the configuration collection before any other code can apply
  // url manipulations.
  configuration.set(CONFIGURATION_COLLECTION_KEY_BASE_URL, getAppBaseUrl());

  store.dispatch(appWillInit(`${window.location.pathname}${window.location.search}`));

  // Execute all registered handlers from the AppInitialization collection
  await appInitialization.initialize({
    dispatch: store.dispatch,
    getState: store.getState,
  });

  store.dispatch(appWillStart(`${window.location.pathname}${window.location.search}`));

  return {
    store,
  };
};
