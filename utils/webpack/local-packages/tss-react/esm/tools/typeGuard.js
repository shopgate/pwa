/**
 * Tiny type-guard helper compatible with tss-react internals.
 *
 * @param {unknown} _value Input value.
 * @param {boolean} isMatched Match result.
 * @returns {boolean}
 */
export function typeGuard(_value, isMatched) {
  return isMatched;
}
