/* eslint-disable no-bitwise */

/**
 * Collapses whitespace in markup, so formatting differences do not change its hash.
 * @param markup The markup.
 * @returns The collapsed markup.
 */
export const collapseMarkup = (markup: string) => markup
  .replace(/\s+/g, ' ')
  .replace(/>\s+</g, '><')
  .trim();

/**
 * Creates a short, non cryptographic hash of a string (cyrb53).
 * @param value The string.
 * @returns The hash in base 36.
 */
export const hashString = (value: string) => {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;

  for (let i = 0; i < value.length; i += 1) {
    const code = value.charCodeAt(i);
    h1 = Math.imul(h1 ^ code, 2654435761);
    h2 = Math.imul(h2 ^ code, 1597334677);
  }

  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
};

/* eslint-enable no-bitwise */
