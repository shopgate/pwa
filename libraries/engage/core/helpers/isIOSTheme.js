// @flow
/**
 * Checks if current theme is an iOS theme.
 * @returns {boolean}
 */
export function isIOSTheme() {
  if (!process.env.THEME) {
    return false;
  }

  return process.env.THEME.includes('ios');
}
