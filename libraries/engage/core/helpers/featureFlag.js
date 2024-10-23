import { themeName, shopNumber } from '@shopgate/pwa-common/helpers/config';
import { isDev } from '@shopgate/engage/core/helpers';

const STORE_KEY_PREFIX = `sgFeatureFlag_${shopNumber}_${themeName}__`;

/**
 * @param {string} key key
 * @returns {string}
 */
export function getFeatureFlag(key) {
  return window.localStorage.getItem(`${STORE_KEY_PREFIX}${key}`);
}

/**
 * @param {string} key key
 */
export function setABFeatureFlag(key) {
  const hasFlag = getFeatureFlag(key);

  // flag is already set for user
  if (hasFlag !== null) {
    return;
  }

  const random = Math.round((Math.random() * 100) + 1);
  window.localStorage.setItem(`${STORE_KEY_PREFIX}${key}`, random);
}

/**
 * @param {string} key Key
 * @param {number} percentage percentage for how many users the flag should be set
 * @returns {boolean}
 */
export function isFeatureEnabled(key, percentage = 10) {
  if (isDev) {
    return true;
  }

  const featureFlagRandomNumber = getFeatureFlag(key);

  return featureFlagRandomNumber <= percentage;
}

