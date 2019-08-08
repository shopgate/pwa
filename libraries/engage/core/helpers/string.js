/**
 * Takes a string and capitalizes the first letter of it.
 * @param {string} text The string to modify.
 * @returns {string}
 */
export const capitalize = text =>
  `${text.charAt(0).toUpperCase()}${text.slice(1)}`;

/**
 * Takes a string and transforms the string into upper case.
 * @param {string} text The string to modify.
 * @returns {string}
 */
export const toUpperCase = text => text.toUpperCase();

/**
 * Takes a string and transforms the string into lower case.
 * @param {string} text The string to modify.
 * @returns {string}
 */
export const toLowerCase = text => text.toLowerCase();
