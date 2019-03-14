export const INDEX_PATH = '/';
export const PAGE_PATH = '/page';
export const LOGIN_PATH = '/login';
export const REGISTER_PATH = '/register';
export const CHECKOUT_PATH = '/checkout';
export const ORDERS_PATH = '/orders';

export const SCANNER_PATTERN = '/scanner/:scope/:type';

/**
 * @param {string} scope The scanner scope to use for the scanner page
 * @param {string} type The scanner type to use on the scanner page
 * @returns {string}
 */
export const scannerPath = (scope, type) => (
  SCANNER_PATTERN.replace(':scope', scope).replace(':type', type)
);

export const PAGE_PATTERN = `${PAGE_PATH}/:pageId`;

/**
 * Our current existing Deeplinks and Push Messages use '/index' for the homepage
 * @type {string}
 */
export const INDEX_PATH_DEEPLINK = '/index';
