/**
 * Creates a hash from a string using a simple hash algorithm.
 * This replaces crypto-js MD5 for non-cryptographic hashing purposes (generating unique IDs).
 *
 * Note: This is NOT cryptographically secure, but suitable for generating unique identifiers.
 *
 * @param {string} input The string to hash.
 * @returns {string} The hex hash string (32 characters, similar to MD5).
 */
export const hashString = (input) => {
  if (!input || typeof input !== 'string') {
    return '0'.repeat(32);
  }

  // Simple hash function that produces a 32-character hex string
  let hash = 0;
  const { length } = input;

  for (let idx = 0; idx < length; idx += 1) {
    const char = input.charCodeAt(idx);
    // Equivalent to (hash << 5) - hash without bitwise operators
    hash = ((hash * 32) - hash) + char;
    // Ensure 32-bit integer by using modulo
    hash %= 2147483648;
  }

  // Convert to positive hex string and pad to 32 chars (MD5 length)
  const hex = Math.abs(hash).toString(16);
  return hex.padStart(32, '0');
};
