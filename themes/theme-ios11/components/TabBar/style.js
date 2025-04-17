import { css } from 'glamor';
import { themeShadows, themeColors, themeVariables } from '@shopgate/pwa-common/helpers/config';

export const hidden = css({
  '&&': {
    display: 'none',
  },
}).toString();

export const customProperties = css({
  '--sg-tab-bar-min-height': `${themeVariables.tabBar.height}px`,
  '--sg-tab-bar-background': themeColors.lightOverlay,
  '--sg-tab-bar-box-shadow': themeShadows.tabBar,

  '--sg-tab-bar-floating-min-height': 'var(--sg-tab-bar-min-height)',
  '--sg-tab-bar-floating-background': 'var(--sg-tab-bar-background)',
  '--sg-tab-bar-floating-border-radius': '16px',
  '--sg-tab-bar-floating-box-shadow': '0 0 12px rgba(0, 0, 0, 0.28)',

  '--sg-tab-bar-item-default-color': themeColors.shade11,
  '--sg-tab-bar-item-highlighted-color': `var(--color-secondary, ${themeColors.accent})`,
  '--sg-tab-bar-item-badge-color': `var(--color-secondary-contrast, ${themeColors.light})`,
  '--sg-tab-bar-item-badge-background': `var(--color-secondary, ${themeColors.accent})`,
  '--sg-tab-bar-item-badge-border-radius': `${themeVariables.gap.small}px`,
});

export const tabBarContainer = css({
  display: 'flex',
  width: '100%',
  position: 'fixed',
  bottom: 0,
  zIndex: 10,
});

export const tabBarContainerFloating = css({
  padding: '0 16px',
});

export const tabBar = css({
  display: 'flex',
  width: '100%',
  minHeight: 'calc(var(--sg-tab-bar-min-height) + var(--safe-area-inset-bottom))',
  paddingBottom: 'var(--safe-area-inset-bottom)',
  zIndex: 10,
  alignItems: 'center',
  justifyContent: 'space-around',
  boxShadow: 'var(--sg-tab-bar-box-shadow)',
  background: 'var(--sg-tab-bar-background)',
  ':before': {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    content: '""',
    zIndex: -1,
  },
});

export const tabBarFloating = css({
  background: 'var(--sg-tab-bar-floating-background)',
  minHeight: 'var(--sg-tab-bar-floating-min-height)',
  padding: '8px 0',
  marginBottom: 'max(16px, var(--safe-area-inset-bottom))',
  borderRadius: 'var(--sg-tab-bar-floating-border-radius)',
  boxShadow: 'var(--sg-tab-bar-floating-box-shadow)',
});

export const transitions = {
  fade: {
    base: css({
      transition: 'opacity 0.2s ease-in-out, visibility 0.2s ease-in-out',
    }),
    in: css({
      opacity: 1,
      visibility: 'visible',
      pointerEvents: 'auto',
    }),
    out: css({
      opacity: 0,
      visibility: 'hidden',
      pointerEvents: 'none',
    }),
  },
  slide: {
    base: css({
      transition: 'transform 0.2s ease-in-out',
    }),
    in: css({
      transform: 'translateY(0)',
    }),
    out: css({
      transform: 'translateY(calc(100% + var(--safe-area-inset-bottom) + 16px))',
    }),
  },
};
