import { css } from 'glamor';

css.global('html, body', {
  background: '#fff',
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
});

const footer = css({
  flexShrink: 1,
  position: 'relative',
});

export default {
  viewport,
  content,
  footer,
};
