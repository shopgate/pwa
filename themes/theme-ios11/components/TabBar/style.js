import { css } from 'glamor';
import { themeShadows, themeColors, themeVariables } from '@shopgate/pwa-common/helpers/config';

css.global('html', {
  '--tab-bar-background': themeColors.lightOverlay,
  '--tab-bar-box-shadow': themeShadows.tabBar,
  '--tab-bar-min-height': `${themeVariables.tabBar.height}px`,

  '--tab-bar-floating-border-radius': '16px',
  '--tab-bar-floating-box-shadow': '0 0 12px rgba(0, 0, 0, 0.28)',
  '--tab-bar-floating-min-height': 'var(--tab-bar-min-height)',

  '--tab-bar-item-default-color': themeColors.shade11,
  '--tab-bar-item-highlighted-color': `var(--color-secondary, ${themeColors.accent})`,

  '--tab-bar-item-badge-color': `var(--color-secondary-contrast, ${themeColors.light})`,
  '--tab-bar-item-badge-background': `var(--color-secondary, ${themeColors.accent})`,
  '--tab-bar-item-badge-border-radius': `${themeVariables.gap.small}px`,
  '--tab-bar-item-badge-top': `-${themeVariables.gap.small}px`,
  '--tab-bar-item-badge-left': 'calc(50% + 20px)',
});

export const hidden = css({
  '&&': {
    display: 'none',
  },
}).toString();

export const tabBarContainerBase = css({
  display: 'flex',
  width: '100%',
  position: 'fixed',
  bottom: 0,
  zIndex: 10,
  justifyContent: 'center',
});

export const tabBarContainerDocked = css({

});

export const tabBarContainerFloating = css({
  padding: '0 16px',
});

export const tabBarBase = css({
  display: 'flex',
  width: '100%',
  zIndex: 10,
  alignItems: 'center',
  justifyContent: 'space-around',
  background: 'var(--tab-bar-background)',
});

export const tabBarDocked = css({
  minHeight: 'calc(var(--tab-bar-min-height) + var(--safe-area-inset-bottom))',
  paddingBottom: 'var(--safe-area-inset-bottom)',
  boxShadow: 'var(--tab-bar-box-shadow)',
});

export const tabBarFloating = css({
  minHeight: 'var(--tab-bar-floating-min-height)',
  padding: '4px 0',
  marginBottom: 'max(16px, var(--safe-area-inset-bottom))',
  borderRadius: 'var(--tab-bar-floating-border-radius)',
  boxShadow: 'var(--tab-bar-floating-box-shadow)',
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
