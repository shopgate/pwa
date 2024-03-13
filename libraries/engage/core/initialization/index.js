import { appConfig } from '@shopgate/engage';
import {
  i18n, configureStore, fetchClientInformation,
} from '@shopgate/engage/core';
import { appWillInit, appWillStart } from '@shopgate/pwa-common/action-creators/app';

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

  store.dispatch(appWillInit(`${window.location.pathname}${window.location.search}`));
  store.dispatch(appWillStart(`${window.location.pathname}${window.location.search}`));

  return {
    store,
  };
};
