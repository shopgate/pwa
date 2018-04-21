import { logger } from './index';
import { getWebStorageEntry } from '../commands/webStorage';

const MODE_AT_MOST = 'at_most';
const MODE_AT_LEAST = 'at_least';

export const PLATFORM_ANDROID = 'android';
export const ANDROID_APP_VERSION_WITHOUT_LIB_CORRECTION = '5.29';
export const MIN_ANDROID_LIB_VERSION = '13.0';

let versions = null;

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
  // If a version object is already present, the request can be skipped.
  if (versions !== null) {
    return versions;
  }
  // TODO avoid paralell requests
  // Fetch the client information.
  const clientInformation = await getWebStorageEntry({ name: 'clientInformation' });

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
   * iOS apps. For those apps the version will be overwritten with a more meaningful value.
   */
  if (platform === PLATFORM_ANDROID &&
      !isVersionAtLeast(ANDROID_APP_VERSION_WITHOUT_LIB_CORRECTION, appVersion)) {
    libVersion = MIN_ANDROID_LIB_VERSION;
  }

  // Update the version cache.
  versions = {
    libVersion,
    appVersion,
    codebaseVersion,
  };

  return versions;
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

/**
 * Clears the local versions cache
 */
export const clearVersionCache = () => {
  versions = null;
};
