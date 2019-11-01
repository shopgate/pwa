import { sortObject } from '../data';

/**
 * Generates a hash from an object with sorted values.
 * @param {Object} input The input object.
 * @return {string} The generated hash.
 */
export function generateSortedHash(input) {
  return JSON.stringify(sortObject(input));
}
