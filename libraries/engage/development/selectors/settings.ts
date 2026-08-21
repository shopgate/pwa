import { createSelector } from 'reselect';
import MobileDetect from 'mobile-detect';
import {
  isDev as isDevelopment,
  hasSGJavaScriptBridge,
} from '@shopgate/engage/core/helpers';
import { DEFAULT_DEVELOPMENT_SETTINGS } from '../reducers/settings';
import type { DevelopmentSettingsState, DevelopmentState } from '../types';

const md = new MobileDetect(navigator.userAgent);

/**
 * Retrieves the development settings state from the store. Falls back to the defaults when the
 * slice is not present - the theme provider reads these on every render, including in tests and
 * hosts that do not register the development reducers.
 * @param state The current application state.
 * @returns The development settings state.
 */
const getState = (state: DevelopmentState): DevelopmentSettingsState =>
  state?.development?.settings ?? DEFAULT_DEVELOPMENT_SETTINGS;

/**
 * Creates a selector to determine if development mode is enabled.
 */
export const getIsDev = createSelector(
  (_state: DevelopmentState) => isDevelopment,
  isDev => isDev
);

/**
 * Creates a selector to determine if the simulated iOS insets are supposed to be shown.
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
 */
export const getAreSimulatedInsetsInjected = createSelector(
  getIsDev,
  getAreInsetsVisible,
  (isDev, insetsVisible) => {
    // No insets injected if the app is not in development mode.
    if (!isDev) { return false; }

    // No insets injected if PWA is running inside the app
    if (hasSGJavaScriptBridge()) {
      return false;
    }

    // If the state contains a bool value, respect is.
    if (typeof insetsVisible === 'boolean') {
      return insetsVisible;
    }

    // Show insets on simulated iOS devices by default if insets decision is not set.
    return insetsVisible === null && md.os() === 'iOS';
  }
);

/**
 * Creates a selector to determine if the CMS2 preview is enabled.
 */
export const getIsCMS2PreviewEnabled = createSelector(
  getState,
  settings => !!settings.cms2PreviewEnabled
);

/**
 * Creates a selector to determine if a color scheme may be selected without the app settings
 * allowing it. Development only - in production the merchant's appearance setting is the only
 * thing that may enable it.
 */
export const getIsColorSchemeSelectionEnabled = createSelector(
  getIsDev,
  getState,
  (isDev, settings) => {
    if (!isDev) { return false; }

    return !!settings.colorSchemeSelectionEnabled;
  }
);
