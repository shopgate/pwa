const STORE_KEY_PREFIX = 'sgFeatureFlag.';

/**
 * @param {string} key key
 * @returns {string}
 */
export function getFeatureFlag(key) {
  return window.localStorage.getItem(`${STORE_KEY_PREFIX}${key}`);
}

/**
 * @param {string} key key
 * @param {number} percentage percentage for how many users the flag should be set
 */
export function setFeatureFlag(key, percentage) {
  const hasFlag = getFeatureFlag(key);

  // flag is already set for user
  if (hasFlag !== null) {
    return;
  }

  const random = (Math.random() * 100) + 1;
  window.localStorage.setItem(`${STORE_KEY_PREFIX}${key}`, random <= percentage);
}

/**
 * @param {string} key Key
 * @returns {boolean}
 */
export function isFeatureEnabled(key) {
  return getFeatureFlag(key) === 'true';
}

