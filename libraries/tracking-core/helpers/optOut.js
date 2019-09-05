const disableStr = 'sg-tracking-disabled';

/**
 * Sets opt out state to localStorage
 * @param {boolean} optOutState true - user opted out of tracking, false - user did not opted out
 * @private
 * @returns {boolean|null} Info about the success
 */
function setLocalStorage(optOutState) {
  if (!(localStorage && localStorage.setItem)) {
    return null;
  }

  if (typeof optOutState !== 'boolean') {
    console.warn('setCookie for outOut invalid param optOutState. Param must be boolean');
    return null;
  }

  try {
    localStorage.setItem(disableStr, optOutState);
  } catch (e) {
    return null;
  }

  return optOutState;
}

/**
 * Gets optOut state from localStorage
 * @private
 * @returns {boolean|null} Opt out state in the localstorage
 */
function getLocalStorage() {
  if (!(localStorage && localStorage.getItem)) {
    return null;
  }

  let state = localStorage.getItem(disableStr);

  if (state === 'false') {
    state = false;
  } else if (state === 'true') {
    state = true;
  }

  return state;
}

/**
 * Sets opt out cookie
 * @param {boolean} optOutState true - user opted out of tracking, false - user did not opted out
 * @private
 * @returns {boolean} Info about the success
 */
function setCookie(optOutState) {
  switch (optOutState) {
    case true:
      document.cookie = `${disableStr}=true; expires=Thu, 18 Jan 2038 03:13:59 UTC; path=/`;
      window[disableStr] = true;
      break;

    case false:
      document.cookie = `${disableStr}=false; expires=Thu, 01 Jan 1970 00:00:01 UTC; path=/`;
      window[disableStr] = false;
      break;

    default:
      console.warn('setCookie for outOut invalid param optOutState. Param must be boolean');
      return false;
  }

  return true;
}

/**
 * Set global + storages
 * @param {boolean} optOutParam If false -> revert the opt out (enable tracking)
 * @private
 * @returns {boolean} optOut State which was set
 */
function setOptOut(optOutParam) {
  window[disableStr] = optOutParam;
  setCookie(optOutParam);
  setLocalStorage(optOutParam);

  return optOutParam;
}

/**
 * Global helper for the opt out mechanism for all tracking tools
 * Sets information to container and inform whoever should
 * be informed (GA)
 *
 * @param {boolean} [optOutParam = true] If false -> revert the opt out (enable tracking)
 * @returns {boolean} - state which was set
 */
function optOut(optOutParam) {
  let out = optOutParam;

  if (typeof optOutParam === 'undefined') {
    out = true;
  }

  setOptOut(out);
  return out;
}

/**
 * Gets optout state from cookie
 * @private
 * @returns {boolean|null} OptOut state from the cookie
 */
function getCookie() {
  if (document.cookie.indexOf(`${disableStr}=true`) > -1) {
    return true;
  }

  if (document.cookie.indexOf(`${disableStr}=false`) > -1) {
    return false;
  }

  return null;
}

/**
 * Check if the opt-out state is set
 *
 * Cookie is privileged.
 *
 * @returns {boolean} Information if the user opt out
 */
function isOptOut() {
  // Check cookie first
  let optOutState = getCookie();

  // No cookie info, check localStorage
  if (optOutState === null) {
    optOutState = getLocalStorage();
  }

  // No localStorage, we get default value
  if (optOutState === null || typeof optOutState === 'undefined') {
    optOutState = false;
  }

  // Set global for the environment
  window[disableStr] = optOutState;

  return optOutState;
}

/**
 * Inits cookie and synchronizes localStorage
 * with information stored in cookie (if needed)
 *
 * Made for migration from SGWebStorage, but should
 * not be removed, since localStorage may be purged
 * from time to time (depends on multiple factors
 * like memory usage and etc.).
 */
function init() {
  setOptOut(isOptOut());
}

init();

export { isOptOut, optOut };
