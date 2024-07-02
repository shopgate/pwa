import {
  APP_FEATURE_PUSH_OPT_IN,
  APP_FEATURE_COOKIE_CONSENT,
} from '@shopgate/engage/core/constants';
import { hasSGJavaScriptBridge } from '@shopgate/pwa-core/helpers';

/**
 * Determines if the app supports the push opt-in feature
 * @returns {boolean}
 */
export const appSupportsPushOptIn = () => {
  if (!hasSGJavaScriptBridge()) {
    // Always supported in development
    return true;
  }

  if (!Array.isArray(window?.SGAppInfo?.featureFlags?.Push?.['1']?.flags)) {
    // Not supported on app versions that don't provide the featureFlags object
    return false;
  }

  // Supported when the feature flags contain the push opt-in flag
  return window.SGAppInfo.featureFlags.Push['1'].flags.includes(APP_FEATURE_PUSH_OPT_IN);
};

/**
 * Determines if the app supports the cookie consent feature
 * @returns {boolean}
 */
export const appSupportsCookieConsent = () => {
  if (!hasSGJavaScriptBridge()) {
    // Always supported in development
    return true;
  }

  if (!Array.isArray(window?.SGAppInfo?.featureFlags?.Analytics?.['1']?.flags)) {
    // Not supported on app versions that don't provide the featureFlags object
    return false;
  }

  // Supported when the feature flags contain the cookie consent flag
  return window.SGAppInfo.featureFlags.Analytics['1'].flags.includes(APP_FEATURE_COOKIE_CONSENT);
};
