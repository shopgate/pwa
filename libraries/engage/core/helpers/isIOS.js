// @flow
/**
 * Checks if current theme is an iOS theme.
 * @returns {boolean}
 */
export function isIOS() {
  if (!process.env.THEME) {
    return false;
  }

  return process.env.THEME.includes('ios');
}
