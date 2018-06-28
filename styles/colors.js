import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const colors = (process.env.NODE_ENV !== 'test' && themeConfig && themeConfig.colors) ? themeConfig.colors : {};

/**
 * Backwards compatible check.
 * `colors` variable comes from webpack and is a result of default colors and colors which were
 * configures in the shop setting.
 *
 * It means it always have primary/primaryContrast colors.
 *
 * If there are no cta/ctaContrast colors configures in this variable, then is should fall back
 * to primary and primaryContrast.
 */
if (!(colors.cta && colors.ctaContrast)) {
  colors.cta = colors.primary;
  colors.ctaContrast = colors.primaryContrast;
}

export default {
  background: '#f8f8f8',
  light: '#fff',
  dark: '#000',
  accent: '#00c3e6',
  placeholder: '#f2f2f2',
  dividers: '#cecece',
  primary: '#fa5400',
  primaryContrast: '#fff',
  darkGray: '#eaeaea',
  shade3: '#9a9a9a',
  shade4: '#b5b5b5',
  shade5: '#ccc',
  shade6: '#656565',
  shade7: '#eaeaea',
  shade8: '#f7f7f7',
  shade9: '#8d8d8d',
  shade10: '#f4f4f4',
  shade11: '#747474',
  shade12: '#8a8a8f',
  success: '#35cc29',
  warning: '#ff9300',
  error: '#ff0000',
  cta: '#fa5400',
  ctaContrast: '#fff',
  ...colors,
};
