/** @module core */
import {
  getCurrentRoute as getCurrentRouteHelper,
  router,
  history,
  parseQueryStringToObject,
  parseObjectToQueryString,
} from '@shopgate/pwa-common/helpers/router';

export * from './environment';
export * from './appFeatures';
export * from './appPermissions';
export * from './baseUrl';
export * from './bridge';
export { isBeta } from '../config/isBeta';
export { getFullImageSource } from './getFullImageSource';
export { getImageFormat } from './getImageFormat';
export { i18n, getWeekDaysOrder } from './i18n';
export { updateLegacyNavigationBar } from './updateLegacyNavigationBar';
export { default as nl2br } from './nl2br';
export * from './string';
export { isIOSTheme } from './isIOSTheme';
export { isTouchDevice } from './isTouchDevice';
export { generateGoogleMapsDirectionsUrl } from './googleMaps';
export { useScrollContainer } from './scrollContainer';
export { getDeviceTypeForCms } from './deviceType';
export * from './featureFlag';

// --------------- CORE --------------- //

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

export { default as errorBehavior } from './errorBehavior';

// --------------- ROUTER --------------- //

export {
  getCurrentRouteHelper,
  router,
  history,
  parseQueryStringToObject,
  parseObjectToQueryString,
};

export {
  push, pop, replace, reset,
} from '../router/helpers';
