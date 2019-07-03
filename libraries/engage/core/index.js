/** @module core */
import {
  getCurrentRoute as getCurrentRouteHelper,
  router,
  history,
  parseQueryStringToObject,
  parseObjectToQueryString,
} from '@shopgate/pwa-common/helpers/router';
import { INDEX_PATH, INDEX_PATH_DEEPLINK } from '@shopgate/pwa-common/constants/RoutePaths';

// --------------- CORE --------------- //

// Classes
// TODO: Contains circular dependency!
// export { default as AppCommand } from '@shopgate/pwa-core/classes/AppCommand';
export { default as GetAppPermissionsRequest } from '@shopgate/pwa-core/classes/AppPermissionsRequest/GetAppPermissionsRequest';
export { default as RequestAppPermissionsRequest } from '@shopgate/pwa-core/classes/AppPermissionsRequest/RequestAppPermissionsRequest';
export { default as BrightnessRequest } from '@shopgate/pwa-core/classes/BrightnessRequest';
export { default as Conditioner } from '@shopgate/pwa-core/classes/Conditioner';
export { default as DataRequest } from '@shopgate/pwa-core/classes/DataRequest';
export { default as DevServerBridge } from '@shopgate/pwa-core/classes/DevServerBridge';
export { default as errorManager, emitter } from '@shopgate/pwa-core/classes/ErrorManager';
export { default as event } from '@shopgate/pwa-core/classes/Event';
export { default as HttpRequest } from '@shopgate/pwa-core/classes/HttpRequest';
export { default as PipelineRequest } from '@shopgate/pwa-core/classes/PipelineRequest';
export { default as ScannerManager } from '@shopgate/pwa-core/classes/ScannerManager';
export { default as WebStorageRequest } from '@shopgate/pwa-core/classes/WebStorageRequest';

// Commands
export { default as analyticsSetCustomValues } from '@shopgate/pwa-core/commands/analyticsSetCustomValues';
export * from '@shopgate/pwa-core/commands/appPermissions';
export * from '@shopgate/pwa-core/commands/brightness';
export { default as broadcastEvent } from '@shopgate/pwa-core/commands/broadcastEvent';
export { default as cleanTab, cleanTabCmd } from '@shopgate/pwa-core/commands/cleanTab';
export { default as closeInAppBrowser } from '@shopgate/pwa-core/commands/closeInAppBrowser';
export { default as flushTab } from '@shopgate/pwa-core/commands/flushTab';
export { default as hideMenuBar } from '@shopgate/pwa-core/commands/hideMenuBar';
export { default as hideNavigationBar } from '@shopgate/pwa-core/commands/hideNavigationBar';
export { default as hideSplashScreen } from '@shopgate/pwa-core/commands/hideSplashScreen';
export { default as onload } from '@shopgate/pwa-core/commands/onload';
export { default as openAppSettings } from '@shopgate/pwa-core/commands/openAppSettings';
export { default as openPage } from '@shopgate/pwa-core/commands/openPage';
export { default as openPageExtern } from '@shopgate/pwa-core/commands/openPageExtern';
export {
  default as performCommandsAfterDelay,
  performCommandsAfterDelayCmd,
} from '@shopgate/pwa-core/commands/performCommandsAfterDelay';
export * from '@shopgate/pwa-core/commands/plotProjects';
export { default as popTabToRoot, popTabToRootCmd } from '@shopgate/pwa-core/commands/popTabToRoot';
export { default as registerEvents } from '@shopgate/pwa-core/commands/registerEvents';
export * from '@shopgate/pwa-core/commands/scanner';
export { default as setCookie } from '@shopgate/pwa-core/commands/setCookie';
export { default as setDebugLoggingEnabled } from '@shopgate/pwa-core/commands/setDebugLoggingEnabled';
export { default as setScrollingEnabled } from '@shopgate/pwa-core/commands/setScrollingEnabled';
export { default as showNavigationBar } from '@shopgate/pwa-core/commands/showNavigationBar';
export { default as showTab } from '@shopgate/pwa-core/commands/showTab';
export * from '@shopgate/pwa-core/commands/unifiedTracking';
// TODO: Contains circular dependency!
// export * from '@shopgate/pwa-core/commands/webStorage';

// Constants
export * from '@shopgate/pwa-core/constants/AppEvents';
export * from '@shopgate/pwa-core/constants/AppPermissions';
export * from '@shopgate/pwa-core/constants/ErrorHandleTypes';
export * from '@shopgate/pwa-core/constants/Pipeline';
export * from '@shopgate/pwa-core/constants/ProcessTypes';
export * from '@shopgate/pwa-core/constants/Scanner';

// Common Constants
export * from '@shopgate/pwa-common/constants/ActionTypes';
export * from '@shopgate/pwa-common/constants/Configuration';
export * from '@shopgate/pwa-common/constants/Device';
export * from '@shopgate/pwa-common/constants/DisplayOptions';
export * from '@shopgate/pwa-common/constants/Pipelines';
export * from '@shopgate/pwa-common/constants/Portals';
export { INDEX_PATH, INDEX_PATH_DEEPLINK };

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

// STREAMS
export * from '@shopgate/pwa-common/streams/main';
export * from '@shopgate/pwa-common/streams/error';

// --------------- APP --------------- //

// ACTIONS
export { default as handleDeepLink } from '@shopgate/pwa-common/actions/app/handleDeepLink';
export { default as handleUniversalLink } from '@shopgate/pwa-common/actions/app/handleUniversalLink';
export { default as handleLink } from '@shopgate/pwa-common/actions/app/handleLink';
export { default as handlePushNotification } from '@shopgate/pwa-common/actions/app/handlePushNotification';
export { default as registerLinkEvents } from '@shopgate/pwa-common/actions/app/registerLinkEvents';
export { default as updateStatusBarBackground } from './actions/updateStatusBarBackground';

// STREAMS
export * from '@shopgate/pwa-common/streams/app';

// --------------- STORE --------------- //

export * from '@shopgate/pwa-common/store';

// --------------- CLIENT --------------- //

// ACTIONS
export { default as fetchClientInformation } from '@shopgate/pwa-common/actions/client/fetchClientInformation';

// CONSTANTS
export * from '@shopgate/pwa-common/constants/client';

// SELECTORS
export * from '@shopgate/pwa-common/selectors/client';

// STREAMS
export * from '@shopgate/pwa-common/streams/client';

// --------------- COLLECTIONS --------------- //

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

// ACTIONS
export { historyPop } from '@shopgate/pwa-common/actions/router/historyPop';
export { historyPush } from '@shopgate/pwa-common/actions/router/historyPush';
export { historyRedirect } from '@shopgate/pwa-common/actions/router/historyRedirect';
export { historyReplace } from '@shopgate/pwa-common/actions/router/historyReplace';
export { historyReset } from '@shopgate/pwa-common/actions/router/historyReset';

// HELPERS
export {
  getCurrentRouteHelper,
  router,
  history,
  parseQueryStringToObject,
  parseObjectToQueryString,
};

export { push, pop, replace, reset } from './router/helpers';

// SELECTORS
export * from '@shopgate/pwa-common/selectors/router';
export * from '@shopgate/pwa-common/selectors/history';

// STREAMS
export * from '@shopgate/pwa-common/streams/router';

// --------------- URL --------------- //

// ACTIONS
export { resetApp } from '@shopgate/pwa-common/action-creators/app';
export * from '@shopgate/pwa-common/action-creators/url';

// SELECTORS
export * from '@shopgate/pwa-common/selectors/url';

// --------------- MENU --------------- //

// ACTIONS
export { default as fetchMenu } from '@shopgate/pwa-common/actions/menu/fetchMenu';

// CONSTANTS
export * from '@shopgate/pwa-common/constants/MenuIDs';

// SELECTORS
export * from '@shopgate/pwa-common/selectors/menu';

// --------------- MODAL --------------- //

// ACTIONS
export { default as closeModal } from '@shopgate/pwa-common/actions/modal/closeModal';
export { default as promiseMap } from '@shopgate/pwa-common/actions/modal/promiseMap';
export { default as showModal } from '@shopgate/pwa-common/actions/modal/showModal';

// CONSTANTS
export * from '@shopgate/pwa-common/constants/ModalTypes';

// HELPERS
export { default as withShowModal } from '@shopgate/pwa-common/helpers/modal/withShowModal';

// SELECTORS
export * from '@shopgate/pwa-common/selectors/modal';

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
