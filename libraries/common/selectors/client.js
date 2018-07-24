import { createSelector } from 'reselect';
import {
  OS_ANDROID,
  OS_IOS,
  MODEL_NAMES_IPHONE_X,
  PAGE_INSETS_ANDROID,
  PAGE_INSETS_IOS,
  PAGE_INSETS_IPHONE_X,
} from '../constants/Device';

/**
 * Returns client state (state.client)
 * @param {Object} state The application state.
 * @returns {Object}
 */
export const getClientInformation = state => state.client;

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
      if (MODEL_NAMES_IPHONE_X.includes(model)) {
        return PAGE_INSETS_IPHONE_X;
      }

      return PAGE_INSETS_IOS;
    }

    return PAGE_INSETS_ANDROID;
  }
);
