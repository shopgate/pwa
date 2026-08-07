import { getCSSCustomProp } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/engage';
import type { Theme, ThemeOptions } from '../createTheme';

const { colors, settings } = themeConfig;

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
          surface: colors.light,
          emphasized: colors.placeholder || '#F2F2F2',
        },
        text: {
          primary: getCSSCustomProp('--color-text-high-emphasis') || '#1A1A1A',
          secondary: getCSSCustomProp('--color-text-medium-emphasis') || '#808080',
        },
      },
      components: {
        border: {
          vars: {
            light: '#F2F2F2',
            medium: '#b5b5b5',
            dark: '#747474',
          },
        },
        price: {
          vars: {
            color: getCSSCustomProp('--color-primary'),
          },
        },
        input: {
          vars: {
            background: '#F2F2F2',
            border: '#CCCCCC',
          },
        },
        separatorLine: {
          vars: {
            borderColor: '#EBEBEF',
          },
        },
        ctaButton: {
          vars: {
            background: getCSSCustomProp('--color-button-cta') || getCSSCustomProp('--color-primary'),
          },
        },
        badge: {
          vars: {
            background: getCSSCustomProp('--color-secondary'),
          },
        },
        snackbar: {
          vars: {
            background: '#323232',
          },
        },
        tabBar: {
          vars: {
            background: 'var(--tab-bar-background, #FFFFFF)',
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
        },
        appBar: {
          vars: {
            background: settings?.['@shopgate/engage/components/AppBar']?.background || '#FFF',
          },
        },
        ratingStars: {
          vars: {
            filled: `var(--rating-stars-filled, ${getCSSCustomProp('--color-primary')})`,
            empty: 'var(--rating-stars-empty, #CCCCCC)',
          },
        },
        swiper: {
          vars: {
            paginationBulletColor: '#b5b5b5',
            paginationBulletActiveColor: '#747474',
            paginationFractionBackground: '#F2F2F2',
            paginationProgressbarBackground: '#F2F2F2',
            paginationProgressbarActiveColor: '#000000',
          },
        },
        cards: {
          vars: {
            // The fallback resolves to the surface color of the scheme the card renders in, so an
            // unconfigured card doesn't stay light while the rest of the app follows the dark
            // scheme. Every color scheme inherits these mappings from the default one.
            backgroundColor: (t: Theme) => `var(--sg-cards-backgroundColor, ${t.palette.background.surface})`,
            // Whole-card padding: insets every element (image + text) from the card edge
            padding: 'var(--sg-cards-padding, 0px)',
            textPadding: 'var(--sg-cards-text-padding, 12px 16px)',
            imagePadding: 'var(--sg-cards-image-padding, 0px)',
            border: 'var(--sg-cards-border-width, 0px) solid var(--sg-cards-border-color, transparent)',
            shadowColor: (t: Theme) => `var(--sg-cards-shadow-color, ${t.palette.shadow})`,
          },
        },
        tiles: {
          vars: {
            backgroundColor: 'var(--sg-tiles-backgroundColor, transparent)',
            // Whole-tile padding: insets every element (image + text) from the tile edge. Defaults
            // to `0` so the image stays flush unless the merchant configures it.
            padding: 'var(--sg-tiles-padding, 0px)',
            textPadding: 'var(--sg-tiles-text-padding, 8px)',
            // The favorites button is centred on the seam between image and details, so its
            // lower half hangs into the details area. The configured inner
            // padding may be smaller, so floor the text's top padding at the overhang, otherwise
            // the button collides with the product name.
            textPaddingTop: 'max(var(--sg-tiles-text-padding, 8px), 16px)',
            imagePadding: 'var(--sg-tiles-image-padding, 0px)',
            border: 'var(--sg-tiles-border-width, 0px) solid var(--sg-tiles-border-color, transparent)',
            shadowColor: (t: Theme) => `var(--sg-tiles-shadow-color, ${t.palette.shadow})`,
          },
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
