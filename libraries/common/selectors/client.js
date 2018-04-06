import { createSelector } from 'reselect';
import {
  OS_ANDROID,
  OS_IOS,
} from '../constants/Device';

/**
 * Returns client state (state.client)
 * @param {Object} state The application state.
 * @returns {Object}
 */
export const getClientInformation = state => state.client;

/**
 * Gets the device information.
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
 * Gets the platform of the device.
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
 * Check if the model of the device.
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
 * Calculates page insets for the current device
 * @param {Object} state The application state.
 * @returns {Object}
 */
export const getPageInsets = createSelector(
  getClientInformation,
  getDeviceModel,
  isIos,
  (clientInformation, model, iOS) => {
    const defaults = {
      safeAreaInsetTop: iOS ? 20 : 0,
      safeAreaInsetBottom: 0,
      safeAreaInsetLeft: 0,
      safeAreaInsetRight: 0,
    };

    let overrides = {};

    if (iOS) {
      const iphoneX = ['iPhone10,3', 'iPhone10,6'];

      // Detect the iPhone X to apply special insets
      if (iphoneX.includes(model)) {
        overrides = {
          safeAreaInsetTop: 40,
          safeAreaInsetBottom: 30,
        };
      }
    }

    return {
      ...defaults,
      ...overrides,
    };
  }
);
