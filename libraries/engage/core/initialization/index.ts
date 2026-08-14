import moment from 'moment';
import type { Store as ReduxStore, UnknownAction } from 'redux';
import { configureStore } from '@shopgate/pwa-common/store';
import { appWillInit, appWillStart } from '@shopgate/pwa-common/action-creators/app';
import {
  i18n,
  getAppBaseUrl,
  isDev,
  hasSGJavaScriptBridge,
  hasWebBridge,
} from '@shopgate/engage/core/helpers';
import fetchClientInformation from '@shopgate/pwa-common/actions/client/fetchClientInformation';
import { appConfig } from '@shopgate/engage';
import { appInitialization, configuration } from '@shopgate/engage/core/collections';
import { CONFIGURATION_COLLECTION_KEY_BASE_URL } from '@shopgate/engage/core/constants';
import { loadCustomStyles, loadThemeCss, loadFontCss } from '@shopgate/engage/styles';
import { getTypographyFontCssUrls } from '@shopgate/engage/settings/selectors/appSettings';
import type { AppSettingsState } from '@shopgate/engage/settings/types/appSettings';
import { fetchSettings } from './fetchSettings';

declare global {
  interface Window {
    SGConnectDev?: {
      isDevBrowser: boolean;
      isDev: boolean;
    };
  }
}

/**
 * The app's redux store. Assembled here because configureStore is untyped JS whose JSDoc widens
 * the return value to `Object`.
 *
 * dispatch stays permissive rather than using redux-thunk's ThunkDispatch: the action creators
 * this module dispatches are untyped JS annotated `@returns {Object}` / `{Function}`, which match
 * neither UnknownAction nor ThunkAction. Tightening it here would only force casts at every call
 * site - it needs the JSDoc on those action creators to be fixed first.
 */
type Store = Omit<ReduxStore<unknown, UnknownAction>, 'dispatch'> & {
  dispatch: (action: unknown) => unknown;
};

const {
  locales: { currency: currencyLocale = null } = {},
} = appConfig as { locales?: { currency?: string | null } };

/**
 * Initializes the app: sets up i18n, creates the store, fetches the client information and the
 * dynamic settings, and runs all registered app initialization handlers.
 * @param locales An object with locales.
 * @param reducers The reducers from the theme.
 * @param subscribers The subscribers to the streams middleware.
 * @returns The initialized store.
 */
export const initialize = async (
  locales: Record<string, unknown>,
  reducers: Parameters<typeof configureStore>[0],
  subscribers: Parameters<typeof configureStore>[1]
) => {
  moment.locale(process.env.LOCALE);

  if (isDev) {
    // Inject an object to the window that can be used to check if the PWA is running in dev mode
    window.SGConnectDev = {
      // Indicates the the current dev app is running in a browser - not in the real app
      isDevBrowser: !hasWebBridge() && !hasSGJavaScriptBridge(),
      // Indicates that the PWA is running in a dev environment
      isDev,
    };
  }

  i18n.init({
    locales,
    lang: process.env.LOCALE,
    currencyLocale,
  });

  const store = configureStore(reducers, subscribers) as unknown as Store;

  try {
    await store.dispatch(fetchClientInformation());
  } catch (e) {
    // Nothing to see here.
  }

  // Save the base url inside the configuration collection before any other code can apply
  // url manipulations.
  configuration.set(CONFIGURATION_COLLECTION_KEY_BASE_URL, getAppBaseUrl());

  store.dispatch(appWillInit(`${window.location.pathname}${window.location.search}`));

  try {
    // The order of the style loaders does not affect the cascade: loadThemeCss and loadFontCss pin
    // their links to their insertion points in the html template, while loadCustomStyles appends
    // its link to the end of the head.
    //
    // The font css urls come from the app settings, so that loader is chained onto fetchSettings
    // rather than started alongside it. Chaining keeps the other two running in parallel with the
    // settings request instead of serializing everything behind it.
    const promises = [
      fetchSettings(store).then(
        () => loadFontCss(getTypographyFontCssUrls(store.getState() as AppSettingsState))
      ),
      loadCustomStyles(),
      loadThemeCss(),
    ];
    await Promise.all(promises);
  } catch (e) {
    // Nothing to see here.
  }

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
