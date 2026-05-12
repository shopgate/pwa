import { getCSSCustomProp } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/engage';
import type { ThemeOptions } from '../createTheme';

const { colors } = themeConfig;

/**
 * Creates the default theme options with legacy palette values.
 * @returns The theme object
 */
export const createDefaultThemeOptions = (): ThemeOptions => ({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: getCSSCustomProp('--color-primary'),
        },
        secondary: {
          main: getCSSCustomProp('--color-secondary'),
        },
        error: {
          main: getCSSCustomProp('--color-state-alert'),
        },
        warning: {
          main: getCSSCustomProp('--color-state-warning'),
        },
        success: {
          main: getCSSCustomProp('--color-state-ok'),
        },
        background: {
          default: colors.light,
        },
        text: {
          primary: getCSSCustomProp('--color-text-high-emphasis'),
          secondary: getCSSCustomProp('--color-text-low-emphasis'),
        },
        tabBar: {
          background: 'var(--tab-bar-background, #FFFFFF)',
          boxShadow: 'var(--tab-bar-box-shadow, 0 -1px 0 0 rgba(0, 0, 0, 0.1))',
          minHeight: 'var(--tab-bar-min-height, 0px)',
          border: '#E6E6E6',
          inactive: 'var(--tab-bar-item-default-color, #747474)',
          active: `var(--tab-bar-item-highlighted-color, ${getCSSCustomProp('--color-secondary')})`,

          floatingBorderRadius: 'var(--tab-bar-floating-border-radius, 16px)',
          floatingBoxShadow: 'var(--tab-bar-floating-box-shadow, 0 0 12px rgba(0, 0, 0, 0.24))',
          floatingMinHeight: 'var(--tab-bar-floating-min-height, 59px)',

          badgeColor: 'var(--tab-bar-item-badge-color, #FFFFFF)',
          badgeBackground: `var(--tab-bar-item-badge-background, ${getCSSCustomProp('--color-secondary')})`,
          badgeBorderRadius: 'var(--tab-bar-item-badge-border-radius, 8px)',
          badgeTop: 'var(--tab-bar-item-badge-top, -8px)',
          badgeLeft: 'var(--tab-bar-item-badge-left, calc(50% + 20px))',
        },
        ratingStars: {
          filled: `var(--rating-stars-filled, ${getCSSCustomProp('--color-primary')})`,
          empty: 'var(--rating-stars-empty, #CCCCCC)',
        },
      },
    },
    dark: {
      palette: {
        background: {
          default: '#000',
        },
        text: {
          primary: '#fff',
          secondary: '#808080',
        },
      },
    },
  },
});
