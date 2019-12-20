import { createSelector } from 'reselect';
import { hasSGJavaScriptBridge } from '@shopgate/pwa-core/helpers';
import { isVersionAtLeast } from '@shopgate/pwa-core/helpers/version';
import { SCANNER_MIN_APP_LIB_VERSION } from '@shopgate/pwa-core/constants/Scanner';
import {
  OS_ANDROID,
  OS_IOS,
  MODEL_NAMES_IPHONE_X,
  PAGE_INSETS_ANDROID,
  PAGE_INSETS_IOS,
  PAGE_INSETS_IPHONE_X,
} from '../constants/Device';

/**
 * Returns the client state (state.client)
 * @param {Object} state The application state.
 * @returns {Object}
 */
export const getClientState = state => state.client;

/**
 * Returns the client info state (state.client.info)
 * @param {Object} state The application state.
 * @returns {Object}
 */
export const getClientInformation = createSelector(
  getClientState,
  state => state.info
);

/**
 * Returns the client connectivity state (state.client.connectivity)
 * @param {Object} state The application state.
 * @returns {Object}
 */
export const getClientConnectivity = createSelector(
  getClientState,
  state => state.connectivity
);

/**
 * Returns the device information.
 * @param {Object} state The application state.
 * @return {Object|null}
 */
export const getDeviceInformation = createSelector(
  getClientInformation,
  (clientInformation) => {
    const { device } = clientInformation;
    return device || null;
  }
);

/**
 * Creates the `getSupportedIdentityServices()` selector.
 * @returns {Function}
 */
export function makeGetSupportedIdentityServices() {
  return createSelector(
    getDeviceInformation,
    info => info.supportedIdentityServices || []
  );
}

/**
 * Creates the `supportsIdentityService()` selector.
 * @param {string} service The identity service to check.
 * @returns {Function}
 */
export function makeSupportsIdentityService(service) {
  const getSupportedIdentityServices = makeGetSupportedIdentityServices();

  return createSelector(
    getSupportedIdentityServices,
    services => services.includes(service)
  );
}

/**
 * Checks if the currently stored lib version is one that supports the scanner.
 * @param {Object} state The application state.
 * @returns {boolean}
 */
export const hasScannerSupport = createSelector(
  getClientInformation,
  clientInformation => isVersionAtLeast(SCANNER_MIN_APP_LIB_VERSION, clientInformation.libVersion)
);

/**
 * Returns the device platform.
 * @param {Object} state The application state.
 * @return {string|null}
 */
export const getPlatform = createSelector(
  getDeviceInformation,
  (deviceInformation) => {
    const { os: { platform = null } = {} } = deviceInformation || {};
    return platform;
  }
);

/**
 * Returns the os version.
 * @return {string|null}
 */
export const getOSVersion = createSelector(
  getDeviceInformation,
  (deviceInformation) => {
    const { os: { ver = null } = {} } = deviceInformation || {};
    return ver;
  }
);

/**
 * Returns the device model.
 * @param {Object} state The application state.
 * @return {string|null}
 */
export const getDeviceModel = createSelector(
  getDeviceInformation,
  (deviceInformation) => {
    const { model = null } = deviceInformation || {};
    return model;
  }
);

/**
 * Check if the platform is Android.
 * @param {Object} state The application state.
 * @return {boolean}
 */
export const isAndroid = createSelector(
  getPlatform,
  platform => platform === OS_ANDROID
);

/**
 * Check if the platform is iOS.
 * @param {Object} state The application state.
 * @return {boolean}
 */
export const isIos = createSelector(
  getPlatform,
  platform => platform === OS_IOS
);

/**
 * Determines page insets for the current device
 * @param {Object} state The application state.
 * @returns {Object}
 */
export const getPageInsets = createSelector(
  getClientInformation,
  getDeviceModel,
  isIos,
  (clientInformation, model, iOS) => {
    if (iOS) {
      if (!hasSGJavaScriptBridge()) {
        return PAGE_INSETS_ANDROID;
      }

      if (MODEL_NAMES_IPHONE_X.includes(model)) {
        return PAGE_INSETS_IPHONE_X;
      }

      return PAGE_INSETS_IOS;
    }

    return PAGE_INSETS_ANDROID;
  }
);

/**
 * Determines what os version handles the insets differently compared to other os versions.
 * @returns {boolean}
 */
export const considerNativeInset = createSelector(
  isIos,
  getOSVersion,
  (ios, ver) => ios && ver && ver.indexOf('10.') === 0
);

/**
 * Checks if the client is connected.
 * @param {Object} state The application state.
 * @returns {boolean}
 */
export const getIsConnected = createSelector(
  getClientConnectivity,
  connectivity => connectivity.connected
);

/**
 * Determines the network type of the client connection e.g. LTE or UMTS.
 * @param {Object} state The application state.
 * @returns {string}
 */
export const getClientConnectivityNetwork = createSelector(
  getClientConnectivity,
  connectivity => connectivity.network
);

/**
 * Determines the type of the client connection e.g. WIFI or 4G.
 * @param {Object} state The application state.
 * @returns {string}
 */
export const getClientConnectivityType = createSelector(
  getClientConnectivity,
  connectivity => connectivity.type
);
