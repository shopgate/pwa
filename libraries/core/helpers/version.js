import MobileDetect from 'mobile-detect';
import detector from 'detector';
import { logger } from './index';

const MODE_AT_MOST = 'at_most';
const MODE_AT_LEAST = 'at_least';

export const PLATFORM_ANDROID = 'android';
export const PLATFORM_IOS = 'ios';
export const MIN_ANDROID_LIB_VERSION = '13.0';

const md = new MobileDetect(navigator.userAgent);
const isAndroid = md.is('AndroidOS');
export const defaultClientInformation = {
  libVersion: MIN_ANDROID_LIB_VERSION,
  appVersion: '5.18.0',
  codebaseVersion: '5.18.0',
  type: (!md.tablet() ? 'phone' : 'tablet'),
  device: {
    os: {
      platform: isAndroid ? PLATFORM_ANDROID : PLATFORM_IOS,
      ver: detector.os.fullVersion,
    },
    model: isAndroid ? 'Android' : `iPhone${detector.os.fullVersion}`,
  },
};

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
 * Checks if a required version matches at least the current lib version.
 * @param {string} requiredVersion The required version - 17[|17.0|17.0.0].
 * @return {Promise}
 */
export const isLibVersionAtLeast = (requiredVersion) => {
  const { libVersion } = defaultClientInformation;
  return isVersionAtLeast(requiredVersion, libVersion);
};

/**
 * Checks if a required version matches at most the current lib version.
 * @param {string} requiredVersion The required version - 17[|17.0|17.0.0].
 * @return {Promise}
 */
export const isLibVersionAtMost = (requiredVersion) => {
  const { libVersion } = defaultClientInformation;
  return isVersionAtMost(requiredVersion, libVersion);
};

/**
 * Checks if a required version matches the current lib version.
 * @param {string} requiredVersion The required version - 17[|17.0|17.0.0].
 * @return {Promise}
 */
export const isLibVersion = (requiredVersion) => {
  const { libVersion } = defaultClientInformation;
  return isVersion(requiredVersion, libVersion);
};

/**
 * Returns the current libVersion.
 * @return {Promise}
 */
export const getLibVersion = () => {
  const { libVersion } = defaultClientInformation;
  return libVersion;
};
