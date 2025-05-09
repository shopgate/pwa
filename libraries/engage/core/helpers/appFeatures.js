import {
  APP_FEATURE_PUSH_OPT_IN,
  APP_FEATURE_COOKIE_CONSENT,
  APP_FEATURE_ANDROID_EDGE_TO_EDGE,
} from '@shopgate/engage/core/constants';
import {
  hasSGJavaScriptBridge,
  hasWebBridge,
  hasNewServices,
  isAndroidOs,
} from '@shopgate/engage/core/helpers';

/**
 * Checks if a specific feature flag is enabled.
 *
 * @param {string} category The top-level category of the featureFlags object
 * (e.g., 'Push', 'Analytics', 'StatusBar').
 * @param {string} flag  The feature flag constant to look for.
 * @returns {boolean}
 */
function isFeatureFlagEnabled(category, flag) {
  // Check if app provides the feature flags of the requested category
  const flags = window?.SGAppInfo?.featureFlags?.[category]?.['1']?.flags;
  // CHeck if the feature flag is provided
  return Array.isArray(flags) && flags.includes(flag);
}

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

  return isFeatureFlagEnabled('Push', APP_FEATURE_PUSH_OPT_IN);
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

  return isFeatureFlagEnabled('Analytics', APP_FEATURE_COOKIE_CONSENT);
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

  return isFeatureFlagEnabled('StatusBar', APP_FEATURE_ANDROID_EDGE_TO_EDGE);
};
