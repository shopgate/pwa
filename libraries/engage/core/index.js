/** @module core */
import {
  getCurrentRoute as getCurrentRouteHelper,
  router,
  history,
  parseQueryStringToObject,
  parseObjectToQueryString,
} from '@shopgate/pwa-common/helpers/router';

// --------------- CORE --------------- //

// Emitters
export { default as UIEvents } from '@shopgate/pwa-core/emitters/ui';

// Helpers
export * from '@shopgate/pwa-core/helpers';
export { default as logGroup } from '@shopgate/pwa-core/helpers/logGroup';
export * from '@shopgate/pwa-core/helpers/version';
export * from '@shopgate/pwa-common/helpers/data';
export * from '@shopgate/pwa-common/helpers/date';
export * from '@shopgate/pwa-common/helpers/dom';
export * from '@shopgate/pwa-common/helpers/environment';
export { default as decodeHTML } from '@shopgate/pwa-common/helpers/html/decodeHTML';
export * from '@shopgate/pwa-common/helpers/html/handleDOM';
export { default as parseHTML } from '@shopgate/pwa-common/helpers/html/parseHTML';
export { default as getTranslator } from '@shopgate/pwa-common/helpers/i18n/getTranslator';
export { default as getPriceFormatter } from '@shopgate/pwa-common/helpers/i18n/getPriceFormatter';
export { default as getDateFormatter } from '@shopgate/pwa-common/helpers/i18n/getDateFormatter';
export { default as getTimeFormatter } from '@shopgate/pwa-common/helpers/i18n/getTimeFormatter';
export { default as getNumberFormatter } from '@shopgate/pwa-common/helpers/i18n/getNumberFormatter';
export * from '@shopgate/pwa-common/helpers/legacy';
// TODO: Can only be exported once the theme uses it. causes issues with the custom routes feature.
/*
export { default as portalCollection } from '@shopgate/pwa-common/helpers/portals/portalCollection';
export { default as routePortals } from '@shopgate/pwa-common/helpers/portals/routePortals';
*/
export * from '@shopgate/pwa-common/helpers/redux';
export * from '@shopgate/pwa-common/helpers/style';
export * from '@shopgate/pwa-common/helpers/tracking';
export * from '@shopgate/pwa-common/helpers/validation';

// --------------- STORE --------------- //

export * from '@shopgate/pwa-common/store';

// --------------- COLLECTIONS --------------- //

export { default as appInitialization } from './collections/AppInitialization';
export { default as authRoutes } from '@shopgate/pwa-common/collections/AuthRoutes';
export { default as redirects } from '@shopgate/pwa-common/collections/Redirects';
export { default as configuration } from '@shopgate/pwa-common/collections/Configuration';
export { default as embeddedMedia } from '@shopgate/pwa-common/collections/EmbeddedMedia';
export { default as persistedReducers } from '@shopgate/pwa-common/collections/PersistedReducers';
export { default as Vimeo } from '@shopgate/pwa-common/collections/media-providers/Vimeo';
export { default as YouTube } from '@shopgate/pwa-common/collections/media-providers/YouTube';

// --------------- CONTEXTS --------------- //

export * from '@shopgate/pwa-common/context';
export { default as AppContext } from './contexts/AppContext';

// --------------- PROVIDERS --------------- //

export { default as LoadingProvider } from '@shopgate/pwa-common/providers/loading';
export { default as LoadingContext } from '@shopgate/pwa-common/providers/loading/context';
export { default as ToastProvider } from '@shopgate/pwa-common/providers/toast';
export { default as ToastContext } from '@shopgate/pwa-common/providers/toast/context';
export { default as AppProvider } from './providers/AppProvider';

// --------------- ROUTER --------------- //

// HELPERS
export {
  getCurrentRouteHelper,
  router,
  history,
  parseQueryStringToObject,
  parseObjectToQueryString,
};

export {
  push, pop, replace, reset,
} from './router/helpers';

// --------------- MODAL --------------- //

// HELPERS
export { default as withShowModal } from '@shopgate/pwa-common/helpers/modal/withShowModal';

// --------------- HOOKS --------------- //

export { useRoute } from './hooks/useRoute';
export { useTheme } from './hooks/useTheme';
export { useCurrentProduct } from './hooks/useCurrentProduct';
export { useNavigation } from './hooks/useNavigation';
export { usePageConfig } from './hooks/usePageConfig';
export { usePageSettings } from './hooks/usePageSettings';
export { useWidgetConfig } from './hooks/useWidgetConfig';
export { useWidgetSettings } from './hooks/useWidgetSettings';
export { useWidgetStyles } from './hooks/useWidgetStyles';
export * from './hooks/html';

// --------------- HOCs --------------- //

export { withTheme } from './hocs/withTheme';
export { withRoute } from './hocs/withRoute';
export { withCurrentProduct } from './hocs/withCurrentProduct';
export { withForwardedRef } from './hocs/withForwardedRef';
export { withNavigation } from './hocs/withNavigation';
export { withWidgetSettings } from './hocs/withWidgetSettings';
export { withWidgetStyles } from './hocs/withWidgetStyles';
export { withApp } from './hocs/withApp';

// --------------- CONFIG --------------- //
export { ThemeConfigResolver } from './config/ThemeConfigResolver';
export { isBeta } from './config/isBeta';
export { getThemeConfig } from './config/getThemeConfig';
export { getThemeSettings } from './config/getThemeSettings';
export { getThemeColors } from './config/getThemeColors';
export { getThemeAssets } from './config/getThemeAssets';
export { getPageConfig } from './config/getPageConfig';
export { getPageSettings } from './config/getPageSettings';
export { getWidgetConfig } from './config/getWidgetConfig';
export { getWidgetSettings } from './config/getWidgetSettings';

// -------------- HELPERS -------------- //
export { i18n } from './helpers/i18n';
export { updateLegacyNavigationBar } from './helpers/updateLegacyNavigationBar';
export { getFullImageSource } from './helpers/getFullImageSource';

export * from './actions';
export * from './classes';
export * from './commands';
export * from './constants';
export * from './initialization';
export * from './selectors';
export * from './streams';
