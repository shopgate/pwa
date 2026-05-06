/**
 * Asserts that a condition is truthy.
 *
 * @param {unknown} condition Condition to assert.
 * @param {string} [msg] Optional error message.
 * @returns {void}
 */
export function assert(condition, msg) {
  if (!condition) {
    throw new Error(msg);
  }
}
