import { createSelector } from 'reselect';
import MobileDetect from 'mobile-detect';
import { isDev as isDevelopment, hasSGJavaScriptBridge } from '@shopgate/engage/core/helpers';

const md = new MobileDetect(navigator.userAgent);

/**
 * Retrieves the development settings state from the store.
 * @param {Object} state The current application state.
 * @return {Object} The development settings state.
 */
const getState = state => state.development.settings;

/**
 * Creates a selector to determine if development mode is enabled.
 * @type {(state: any) => boolean}
 */
export const getIsDev = createSelector(
  () => isDevelopment
);

/**
 * Creates a selector to determine if the simulated iOS insets are supposed to be shown.
 * @type {(state: any) => boolean}
 */
export const getAreInsetsVisible = createSelector(
  getIsDev,
  getState,
  (isDev, settings) => {
    if (!isDev) { return false; }

    return settings.showInsets;
  }
);

/**
 * Creates a selector to determine if the inset highlight is visible.
 * @type {(state: any) => boolean}
 */
export const getIsInsetHighlightVisible = createSelector(
  getIsDev,
  getState,
  (isDev, settings) => {
    if (!isDev) { return false; }

    return settings.showInsetHighlight;
  }
);

/**
 * Creates a selector to check if simulated safe area insets are supposed to be injected.
 * @type {(state: any) => boolean}
 */
export const getAreSimulatedInsetsInjected = createSelector(
  getIsDev,
  getAreInsetsVisible,
  (isDev, insetsVisible) => {
    if (!isDev) { return false; }

    return !hasSGJavaScriptBridge() && (insetsVisible || md.os() === 'iOS');
  }
);
