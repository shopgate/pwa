import { css } from 'glamor';
import { themeConfig } from '@shopgate/engage';
import { isAndroidOs } from '@shopgate/engage/core/helpers';

const { colors, shadows, variables } = themeConfig;

css.global(':root', {
  '--tab-bar-background': colors.lightOverlay,
  '--tab-bar-box-shadow': shadows.tabBar,
  '--tab-bar-min-height': `${variables.tabBar.height}px`,

  '--tab-bar-floating-border-radius': '16px',
  '--tab-bar-floating-box-shadow': '0 0 12px rgba(0, 0, 0, 0.24)',
  '--tab-bar-floating-min-height': '59px',

  '--tab-bar-item-default-color': colors.shade11,
  '--tab-bar-item-highlighted-color': `var(--color-secondary, ${colors.accent})`,

  '--tab-bar-item-badge-color': `var(--color-secondary-contrast, ${colors.light})`,
  '--tab-bar-item-badge-background': `var(--color-secondary, ${colors.accent})`,
  '--tab-bar-item-badge-border-radius': `${variables.gap.small}px`,
  '--tab-bar-item-badge-top': `-${variables.gap.small}px`,
  '--tab-bar-item-badge-left': 'calc(50% + 20px)',
});

export const hidden = css({
  display: 'none !important',
});

export const tabBarContainerBase = css({
  display: 'flex',
  width: '100%',
  position: 'fixed',
  bottom: 0,
  zIndex: 10,
  justifyContent: 'center',
});

export const tabBarContainerDocked = css({
  background: 'var(--tab-bar-background)',
  minHeight: 'calc(var(--tab-bar-min-height) + var(--safe-area-inset-bottom))',
  boxShadow: 'var(--tab-bar-box-shadow)',
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
});

export const tabBarDocked = css({
  paddingBottom: 'var(--safe-area-inset-bottom)',
});

export const tabBarFloating = css({
  background: 'var(--tab-bar-background)',
  minHeight: 'var(--tab-bar-floating-min-height)',
  padding: '4px 0',
  // Ensure at least 16px bottom margin for the floating tab bar.
  // On Android, add 8px to the safe area inset to avoid overlap with on-screen navigation buttons.
  marginBottom: `max(16px, calc(var(--safe-area-inset-bottom) + ${isAndroidOs ? '8px' : '0px'}))`,
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

