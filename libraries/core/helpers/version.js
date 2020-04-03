import MobileDetect from 'mobile-detect';
import detector from 'detector';
import { logger, hasSGJavaScriptBridge } from './index';
import getWebStorageEntry from '../commands/getWebStorageEntry';

const MODE_AT_MOST = 'at_most';
const MODE_AT_LEAST = 'at_least';

export const PLATFORM_ANDROID = 'android';
export const PLATFORM_IOS = 'ios';
export const MIN_ANDROID_LIB_VERSION = '13.0';

let versions = null;
let requesting = false;

const md = new MobileDetect(navigator.userAgent);
export const isAndroid = md.is('AndroidOS');
const fullVersion = typeof detector === 'object' && detector.os ? detector.os.fullVersion : null;

// Eslint doesn't allow to use one liner here.
let model = null;
if (fullVersion) {
  model = isAndroid ? 'Android' : `iPhone${fullVersion}`;
}

export const defaultClientInformation = {
  libVersion: '21.0',
  appVersion: '5.18.0',
  codebaseVersion: '5.18.0',
  type: (!md.tablet() ? 'phone' : 'tablet'),
  device: {
    type: (!md.tablet() ? 'phone' : 'tablet'),
    os: {
      platform: isAndroid ? PLATFORM_ANDROID : PLATFORM_IOS,
      ver: fullVersion,
    },
    model,
  },
  supportedAnalyticsServices: [],
};

/**
 * Waits till a passed handler function returns TRUE and resolves.
 * @param {Function} handler Handler function which checks a condition to resolve.
 * @return {Promise}
 */
const wait = handler => new Promise((resolve) => {
  /**
   * Checks the request state.
   */
  const check = () => {
    if (handler() === true) {
      resolve();
    } else {
      setTimeout(check, 20);
    }
  };
  check();
});

/**
 * Splits a version string into it's segments.
 * @param {string} input The string to parse.
 * @return {Array}
*/
const parseVersionSegments = (input) => {
  if (typeof input !== 'string') {
    return [Number.NaN];
  }

  return input.trim().split('.').map(segment => parseInt(segment, 10));
};

/**
 * Validates version segments.
 * @param {Array} segments The segments array.
 * @return {boolean}
 */
const validateVersionSegments = segments =>
  segments.filter(entry => Number.isNaN(entry)).length === 0;

/**
 * Checks if a required version matches a current version.
 * @param {string} mode The mode for the check.
 * @param {string} requiredVersion The required version - 17[|17.0|17.0.0].
 * @param {string} currentVersion The current version (same pattern).
 * @return {boolean}
 */
const check = (mode, requiredVersion = '', currentVersion = '') => {
  const parsedCurrent = parseVersionSegments(currentVersion);
  const parsedRequired = parseVersionSegments(requiredVersion);

  if (!validateVersionSegments(parsedCurrent) || !validateVersionSegments(parsedRequired)) {
    logger.error(`Error parsing version strings (current: ${currentVersion} | required: ${requiredVersion})`);
    return false;
  }

  const [requiredMajor, requiredMinor = 0, requiredMicro = 0] = parsedRequired;
  const [currentMajor, currentMinor = 0, currentMicro = 0] = parsedCurrent;

  if (mode === MODE_AT_LEAST) {
    if (currentMajor !== requiredMajor) {
      return (currentMajor > requiredMajor);
    }

    if (currentMinor !== requiredMinor) {
      return (currentMinor > requiredMinor);
    }

    return (currentMicro >= requiredMicro);
  }

  // MODE_AT_MOST - no extra branch necessary, since it's just an internal function right now.
  if (currentMajor !== requiredMajor) {
    return (currentMajor < requiredMajor);
  }

  if (currentMinor !== requiredMinor) {
    return (currentMinor < requiredMinor);
  }

  return (currentMicro <= requiredMicro);
};

/**
 * Checks if a version string is valid.
 * @param {string} input The string to check - 17[|17.0|17.0.0].
 * @return {boolean}
 */
export const isValidVersion = input =>
  validateVersionSegments(parseVersionSegments(input));

/**
 * Checks if a required version matches at least a current version.
 * @param {string} requiredVersion The required version - 17[|17.0|17.0.0].
 * @param {string} currentVersion The current version (same pattern).
 * @return {boolean}
 */
export const isVersionAtLeast = (requiredVersion, currentVersion) =>
  check(MODE_AT_LEAST, requiredVersion, currentVersion);

/**
 * Checks if a required version matches at most a current version.
 * @param {string} requiredVersion The required version - 17[|17.0|17.0.0].
 * @param {string} currentVersion The current (same pattern).
 * @return {boolean}
 */
export const isVersionAtMost = (requiredVersion, currentVersion) =>
  check(MODE_AT_MOST, requiredVersion, currentVersion);

/**
 * Checks if a required version is equal to a current version.
 * @param {string} requiredVersion The required version - 17[|17.0|17.0.0].
 * @param {string} currentVersion The current (same pattern).
 * @return {boolean}
 */
export const isVersion = (requiredVersion, currentVersion) =>
  (isVersionAtLeast(requiredVersion, currentVersion) === true) &&
  (isVersionAtMost(requiredVersion, currentVersion) === true);

/**
* Fetches versions from the client information webStorage entry.
* @return {Promise}
*/
const getVersionsFromClientInformation = async () => {
  /**
   * Checks if currently no request is ongoing.
   * @return {boolean}
   */
  const isIdle = () => requesting === false;
  if (!isIdle()) {
    // Wait until the request finished before proceed.
    await wait(isIdle);
  }
  // If a version object is already present, the request can be skipped.
  if (versions !== null) {
    return versions;
  }
  requesting = true;
  let clientInformation;

  // Fetch the client information.
  if (!hasSGJavaScriptBridge()) {
    clientInformation = { value: { ...defaultClientInformation } };
  } else {
    clientInformation = await getWebStorageEntry({ name: 'clientInformation' });
  }

  // Grab all relevant data from the client information.
  let { libVersion } = clientInformation.value;
  const {
    appVersion,
    codebaseVersion,
    device,
  } = clientInformation.value;
  /* istanbul ignore next */
  const { os: { platform = null } = {} } = device || {};
  /**
  * Older Android app versions didn't handle the libVersion within the client information like the
  * iOS apps. Those apps usually send a version 2.0. But since they also support most of the PWA
  * related commands, the lib version is corrected here to improve handling within the code.
  */
  if (platform === PLATFORM_ANDROID && !isVersionAtLeast('9.0', libVersion)) {
    libVersion = MIN_ANDROID_LIB_VERSION;
  }
  // Update the version cache.
  versions = {
    libVersion,
    appVersion,
    codebaseVersion,
  };
  requesting = false;
  return versions;
};

/**
 * Clears the local versions cache
 */
export const clearVersionCache = () => {
  versions = null;
};

/**
 * Checks if a required version matches at least the current lib version.
 * @param {string} requiredVersion The required version - 17[|17.0|17.0.0].
 * @return {Promise}
 */
export const isLibVersionAtLeast = async (requiredVersion) => {
  const { libVersion } = await getVersionsFromClientInformation();
  return isVersionAtLeast(requiredVersion, libVersion);
};

/**
 * Checks if a required version matches at most the current lib version.
 * @param {string} requiredVersion The required version - 17[|17.0|17.0.0].
 * @return {Promise}
 */
export const isLibVersionAtMost = async (requiredVersion) => {
  const { libVersion } = await getVersionsFromClientInformation();
  return isVersionAtMost(requiredVersion, libVersion);
};

/**
 * Checks if a required version matches the current lib version.
 * @param {string} requiredVersion The required version - 17[|17.0|17.0.0].
 * @return {Promise}
 */
export const isLibVersion = async (requiredVersion) => {
  const { libVersion } = await getVersionsFromClientInformation();
  return isVersion(requiredVersion, libVersion);
};

/**
 * Returns the current libVersion.
 * @return {Promise}
 */
export const getLibVersion = async () => {
  const { libVersion } = await getVersionsFromClientInformation();
  return libVersion;
};
