import Color from 'color';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { hasWebBridge, hasNewServices } from '@shopgate/engage/core/helpers';
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

  if (hasWebBridge()) {
    setCSSCustomProp('--page-background-color', '#fff');
  }

  const sideNavigationBackground = Color(getCSSCustomProp('--color-primary') || colors.primary).alpha(0.08);
  setCSSCustomProp('--color-side-navigation-active-background', sideNavigationBackground);

  setCSSCustomProp('--color-button-cta', 'var(--color-primary)');
  setCSSCustomProp('--color-button-cta-contrast', 'var(--color-primary-contrast)');

  if (!getCSSCustomProp('--color-button-dialog-ios')) {
    setCSSCustomProp('--color-button-dialog-ios', '#1a73e8');
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

  if (!hasNewServices()) {
    setCSSCustomProp('--color-button-cta', colors.cta);
    setCSSCustomProp('--color-button-cta-contrast', colors.ctaContrast);
  } else {
    setCSSCustomProp('--color-button-cta', 'var(--color-primary)');
    setCSSCustomProp('--color-button-cta-contrast', 'var(--color-primary-contrast)');
  }

  if (!getCSSCustomProp('--color-button-dialog-ios')) {
    setCSSCustomProp('--color-button-dialog-ios', '#1a73e8');
  }

  setCSSCustomProp('--color-text-high-emphasis', '#212121');
  setCSSCustomProp('--color-text-medium-emphasis', '#666666');
  setCSSCustomProp('--color-text-low-emphasis', '#9e9e9e');
  setCSSCustomProp('--color-background-accent', '#f7f7f7');

  setCSSCustomProp('--color-state-alert', colors.error);
  setCSSCustomProp('--color-state-warning', colors.warning);
  setCSSCustomProp('--color-state-ok', colors.success);

  const sideNavigationBackground = Color(getCSSCustomProp('--color-primary') || colors.primary).fade(0.9);
  setCSSCustomProp('--color-side-navigation-active-background', sideNavigationBackground);

  if (hasWebBridge()) {
    setCSSCustomProp('--page-background-color', '#fff');
  }
};
