import { getCSSCustomProp } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/engage';
import type { ThemeOptions } from '../createTheme';

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
        discountBadge: {
          vars: {
            background: 'var(--sg-palette-primary-main)',
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
      },
    },
    dark: {
      palette: {
        // No primary or secondary here on purpose. Both inherit from the light scheme, so a
        // merchant's brand colors carry over instead of being replaced by a hard coded pair.
        error: {
          main: '#FF6B6B',
        },
        warning: {
          main: '#FFA726',
        },
        success: {
          main: '#5DD954',
        },
        background: {
          default: '#000000',
          surface: '#1C1C1E',
          emphasized: '#2C2C2E',
        },
        text: {
          primary: '#F2F2F7',
          secondary: '#AEAEB2',
        },
        grey: {
          light: '#2C2C2E',
          medium: '#48484A',
          dark: '#8E8E93',
        },
        action: {
          disabled: '#8E8E93',
          disabledBackground: '#48484A',
          pressed: '#2C2C2E',
        },
      },
      components: {
        border: {
          vars: {
            light: '#38383A',
            medium: '#48484A',
            dark: '#8E8E93',
          },
        },
        input: {
          vars: {
            background: '#2C2C2E',
            border: '#48484A',
          },
        },
        separatorLine: {
          vars: {
            borderColor: '#38383A',
          },
        },
        snackbar: {
          vars: {
            background: '#2C2C2E',
          },
        },
        tabBar: {
          vars: {
            background: '#1C1C1E',
            border: '#374151',
            inactive: '#9CA3AF',
            floatingBoxShadow: '0 0 12px rgba(0, 0, 0, 0.6)',
          },
        },
        appBar: {
          vars: {
            background: '#1C1C1E',
          },
        },
        discountBadge: {
          vars: {
            background: '#FF0000',
          },
        },
        ratingStars: {
          vars: {
            empty: '#48484A',
          },
        },
        cards: {
          vars: {
            backgroundColor: '#1C1C1E',
            borderColor: '#38383A',
          },
        },
        tiles: {
          vars: {
            backgroundColor: '#1C1C1E',
            borderColor: '#38383A',
          },
        },
        swiper: {
          vars: {
            paginationBulletColor: '#AEAEB2',
            paginationBulletActiveColor: '#F2F2F7',
            paginationFractionBackground: '#2C2C2E',
            paginationProgressbarBackground: '#48484A',
            paginationProgressbarActiveColor: '#FFFFFF',
          },
        },
      },
    },
  },
});
