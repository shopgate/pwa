import { SCANNER_PATH } from '../constants';

/**
 * @param {string} scope The scanner scope to use for the scanner page
 * @param {string} type The scanner type to use on the scanner page
 * @returns {string}
 */
export const getScannerRoute = (scope, type) => `${SCANNER_PATH}?scope=${scope}&type=${type}`;
