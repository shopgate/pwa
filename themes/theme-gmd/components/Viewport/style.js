import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

css.global('html, body', {
  background: colors.background,
});

/**
 * By default the GMD theme doesn't have a tabbar. But it's conceivable that 3rd party developers
 * might want to implement one via an extension. So the code which calculates content bottom
 * paddings for example is prepared to deal with it. For now the value is initialized with 0.
 */
css.global('html', {
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

  css.global(':root', {
    '--safe-area-inset-top': `${safeAreaInsetTop}px`,
    '--safe-area-inset-bottom': `${safeAreaInsetBottom}px`,
  });
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

const footer = css({
  bottom: 0,
  flexShrink: 1,
  position: 'relative',
  zIndex: 1,
});

export default {
  viewport,
  content,
  header,
  footer,
};
