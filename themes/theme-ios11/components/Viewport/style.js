import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;
const defaultBackgroundColor = colors.light;
const { style } = document.documentElement;

css.global('html, body', {
  background: 'var(--page-background-color)',
});

css.global('html', {
  '--page-background-color': defaultBackgroundColor,
  '--tabbar-height': '0px',
});

css.global('body', {
  userSelect: 'none',
});

/**
 * Updates the page inset css variables
 * @param {Object} pageInsets A page insets object
 */
export const updatePageInsets = (pageInsets) => {
  const {
    safeAreaInsetTop,
    safeAreaInsetBottom,
  } = pageInsets;

  /**
   * Try to use environment variables for the insets. On Android those variables are not available,
   * on iOS devices without notch their value is 0px. To cover these different environments,
   * the usage of the max() function implements a fallback mechanism, which is based on the values
   * from the device constants.
   */
  css.global(':root', {
    '--safe-area-inset-top': `max(${safeAreaInsetTop}px, env(safe-area-inset-top))`,
    '--safe-area-inset-bottom': `max(${safeAreaInsetBottom}px, env(safe-area-inset-bottom))`,
  });
};

/**
 * Updates the page background color.
 * @param {string} color The new background color.
 */
export const updatePageBackgroundColor = (color = defaultBackgroundColor) => {
  if (style.getPropertyValue('--page-background-color') !== color) {
    style.setProperty('--page-background-color', color);
  }
};

const viewport = css({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  overflow: 'hidden',
  position: 'relative',
  width: '100vw',
});

const content = css({
  flexGrow: 1,
  position: 'relative',
  zIndex: 0,
});

const header = css({
  top: 0,
  flexShrink: 1,
  position: 'relative',
  zIndex: 1,
});

export default {
  viewport,
  content,
  header,
};
