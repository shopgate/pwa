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
  '--color-primary': colors.primary,
  '--color-primary-contrast': colors.primaryContrast,
  '--color-secondary': colors.accent,
  '--color-secondary-contrast': colors.accentContrast,
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
   * we need to provide two different strategies with the help of media queries.
   *
   * Android doesn't support the max() function, but we can just use the insets from the params
   * (they will always be 0px anyway). On iOS the page insets from the params will always contain
   * values > 0px, but on notch devices the required insets might need to be bigger.
   * Since all iOS versions which are shipped with notch iPhones support max(), we can use it to
   * determine the appropriate value for the css variables which can be used in the Engage css
   * when insets need to be considered.
   */

  const id = 'safe-area-insets';
  let styleBlock = document.querySelector(`#${id}`);

  if (!styleBlock) {
    styleBlock = document.createElement('style');
    styleBlock.setAttribute('type', 'text/css');
    styleBlock.setAttribute('id', id);
    document.querySelector('head').appendChild(styleBlock);
  }

  styleBlock.innerHTML = `
    @supports not (padding: max(0px)) {
      :root {
        --safe-area-inset-top: ${safeAreaInsetTop}px;
        --safe-area-inset-bottom: ${safeAreaInsetBottom}px;
      }
    }

    @supports(padding: max(0px)) {
      :root {
        --safe-area-inset-top: max(${safeAreaInsetTop}px, env(safe-area-inset-top));
        --safe-area-inset-bottom: max(${safeAreaInsetBottom}px, env(safe-area-inset-bottom));
      }
    }
  `;
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
