import { css } from 'glamor';
import variables from 'Styles/variables';

css.global('html', {
  '--tabbar-height': `${variables.tabBar.height}px`,
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

export default css({
  minHeight: '100vh',
  overflowX: 'hidden',
  width: '100vw',
  position: 'relative',
}).toString();
