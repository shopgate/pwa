import { generateSortedHash } from './generateSortedHash';

/**
 * Deep compares two objects.
 * @param {Object} input1 The first object.
 * @param {Object} input2 The second object.
 * @return {boolean}
 */
export function compareObjects(input1, input2) {
  return generateSortedHash(input1) === generateSortedHash(input2);
}
