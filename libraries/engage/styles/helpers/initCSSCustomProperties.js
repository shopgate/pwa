import Color from 'color';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { getCSSCustomProp, setCSSCustomProp } from './cssCustomProperties';

const { colors } = themeConfig;

/**
 * Calculates a contrast color for a color
 * @param {string} color A color
 * @returns {string}
 */
const getContrastColor = (color) => {
  const perceivedLuminosity = Color(color).luminosity();

  return perceivedLuminosity >= 0.74 ? colors.dark : colors.light;
};

/**
 * Initializes the CSS custom properties after they where loaded from a CSS file.
 * When the CSS file doesn't contain contrast colors, they will be calculated automatically.
 */
export const initCSSCustomProps = () => {
  const primary = getCSSCustomProp('--color-primary');
  const primaryContrast = getCSSCustomProp('--color-primary-contrast');
  const secondary = getCSSCustomProp('--color-secondary');
  const secondaryContrast = getCSSCustomProp('--color-secondary-contrast');

  if (primary && !primaryContrast) {
    setCSSCustomProp('--color-primary-contrast', getContrastColor(primary));
  }

  if (secondary && !secondaryContrast) {
    setCSSCustomProp('--color-secondary-contrast', getContrastColor(secondary));
  }
};

/**
 * Initializes fallback CSS custom properties from the theme colors.
 */
export const initCSSCustomPropsFallback = () => {
  setCSSCustomProp('--color-primary', colors.primary);
  setCSSCustomProp('--color-primary-contrast', getContrastColor(colors.primary));
  setCSSCustomProp('--color-secondary', colors.accent);
  setCSSCustomProp('--color-secondary-contrast', getContrastColor(colors.accent));
};
