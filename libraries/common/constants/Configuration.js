export const APP_PLATFORM = 'APP_PLATFORM';
export const RESET_APP_REDUCERS = 'RESET_APP_REDUCERS';
export const DEFAULT_PRODUCTS_FETCH_PARAMS = 'DEFAULT_PRODUCTS_FETCH_PARAMS';
export const TAB_BAR_PATTERNS_BLACK_LIST = 'TAB_BAR_PATTERNS_BLACK_LIST';
export const CONFIGURATION_COLLECTION_KEY_BASE_URL = 'CONFIGURATION_COLLECTION_KEY_BASE_URL';
export const PIPELINES = 'PIPELINES';
export const IS_CONNECT_EXTENSION_ATTACHED = 'IS_CONNECT_EXTENSION_ATTACHED';

/**
 * This configuration collection key can be used to register a helper function to modify external
 * image urls that are not delivered via the Shopgate CDN. The handler allows to add additional
 * parameters to the image url to e.g. set resolution, format or quality.
 *
 * The handler function receives the source url and an object containing the options for the image.
 * @param {string} src - The plain source URL of the image.
 * @param {Object} options - An object containing parameters for the image.
 * @param {number} options.width - The desired width of the image in pixels.
 * @param {number} options.height - The desired height of the image in pixels.
 * @param {string} options.fillColor - A hex color code to use as the background fill color.
 * @param {number} options.quality - The quality of the image (e.g., for compression) as percentage.
 * @param {string} options.format - The desired image format (e.g., 'jpeg', 'png').
 * @returns {string|null|undefined} - The modified image URL.
 *
 * @example
 * configuration.set(
 *  CONFIGURATION_COLLECTION_CREATE_EXTERNAL_IMAGE_URL,
 *  (baseUrl, { width } = {}) => {
 *    if (!baseUrl || !baseUrl.startsWith('https://mycdn.com')) {
 *      return null;
 *    }
 *    return `${baseUrl}?width=${width}`;
 *   }
 * );
 */
export const CONFIGURATION_COLLECTION_CREATE_EXTERNAL_IMAGE_URL =
  'CONFIGURATION_COLLECTION_CREATE_EXTERNAL_IMAGE_URL';

export const CONFIGURATION_COLLECTION_KEY_THEME_TYPOGRAPHY = 'CONFIGURATION_COLLECTION_KEY_THEME_TYPOGRAPHY';
