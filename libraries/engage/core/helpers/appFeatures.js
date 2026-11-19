import {
  APP_FEATURE_PUSH_OPT_IN,
  APP_FEATURE_COOKIE_CONSENT,
  APP_FEATURE_ANDROID_EDGE_TO_EDGE,
  APP_FEATURE_BIOMETRIC_LOGIN,
  APP_FEATURE_IN_APP_BROWSER_COLORS,
} from '@shopgate/engage/core/constants';
import {
  hasSGJavaScriptBridge,
  hasWebBridge,
  hasNewServices,
  isAndroidOs,
} from '@shopgate/engage/core/helpers';
import { isAppFeatureFlagEnabled } from './appFeatureFlags';

/**
 * Determines if the app supports the push opt-in feature
 * @returns {boolean}
 */
export const appSupportsPushOptIn = () => {
  if (hasWebBridge() || hasNewServices()) {
    // Not push notifications in browser mode. Deactivated for new system for now
    return false;
  }

  if (!hasSGJavaScriptBridge()) {
    // Always supported in development
    return true;
  }

  return isAppFeatureFlagEnabled('Push', APP_FEATURE_PUSH_OPT_IN);
};

/**
 * Determines if the app supports the cookie consent feature
 * @returns {boolean}
 */
export const appSupportsCookieConsent = () => {
  if (hasWebBridge()) {
    // Deactivated in browser mode for now
    return false;
  }

  if (!hasSGJavaScriptBridge()) {
    // Always supported in development
    return true;
  }

  return isAppFeatureFlagEnabled('Analytics', APP_FEATURE_COOKIE_CONSENT);
};

/**
 * Determines if the app supports Android with edge-to-edge screens
 * @returns {boolean}
 */
export const appSupportsAndroidEdgeToEdge = () => {
  if (hasWebBridge()) {
    // Deactivated in browser mode
    return false;
  }

  if (!hasSGJavaScriptBridge() && isAndroidOs) {
    // Active in dev environment with Android user agent
    return true;
  }

  return isAppFeatureFlagEnabled('StatusBar', APP_FEATURE_ANDROID_EDGE_TO_EDGE);
};

/**
 * Determines if the app supports the biometric login feature
 * @returns {boolean}
 */
export const appSupportsBiometricLogin = () => {
  if (hasWebBridge() || !hasSGJavaScriptBridge()) {
    return false;
  }

  return isAppFeatureFlagEnabled('Keychain', APP_FEATURE_BIOMETRIC_LOGIN);
};

/**
 * Determines if the app themes its in-app browser with the header colors sent by the PWA
 * @returns {boolean}
 */
export const appSupportsInAppBrowserColors = () => {
  if (hasWebBridge() || !hasSGJavaScriptBridge()) {
    return false;
  }

  return isAppFeatureFlagEnabled('InAppBrowser', APP_FEATURE_IN_APP_BROWSER_COLORS);
};
