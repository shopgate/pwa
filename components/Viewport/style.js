import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;
const defaultBackgroundColor = colors.background;
const { style } = document.documentElement;

css.global('html, body', {
  background: 'var(--page-background-color)',
});

css.global('html', {
  '--page-background-color': defaultBackgroundColor,
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

  css.global(':root', {
    '--safe-area-inset-top': `${safeAreaInsetTop}px`,
    '--safe-area-inset-bottom': `${safeAreaInsetBottom}px`,
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
