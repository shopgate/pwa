import { css } from 'glamor';
import { themeVariables, themeShadows, themeColors } from '@shopgate/pwa-common/helpers/config';

const { style } = document.documentElement;

/**
 * Sets a global css variable that indicates the current height of the TabBar
 * @param {boolean} isVisible The current visibility state
 */
export const updateHeightCSSProperty = (isVisible) => {
  const value = `${isVisible ? themeVariables.tabBar.height : 0}px`;
  /**
   * Update the css property with the correct value. Glamor can't be used here,
   * since it's not capable to update variables within the global scope.
   */
  if (style.getPropertyValue('--tabbar-height') !== value) {
    style.setProperty('--tabbar-height', value);
  }
};

/**
 * @TODO Use Transition component
 * @type {never}
 */
export const inVisible = css({
  '&&': {
    display: 'none',
  },
}).toString();

const fadeOut = css.keyframes({
  '0%': { opacity: 1 },
  '99%': { opacity: 0.01, height: 'var(--tabbar-height)' },
  '100%': { opacity: 0, height: 0 },
});
const fadeIn = css.keyframes({
  '0%': { opacity: 0, height: 0 },
  '1%': { opacity: 0.01, height: 'var(--tabbar-height)' },
  '100%': { opacity: 1, height: 'var(--tabbar-height)' },
});

export const scrolledIn = css({
  '&&': {
    animation: `${fadeIn} .2s`,
    animationFillMode: 'forwards',
  },
}).toString();

export const scrolledOut = css({
  '&&': {
    animation: `${fadeOut} .2s`,
    animationFillMode: 'forwards',
  },
}).toString();

export default css({
  display: 'flex',
  height: 'var(--tabbar-height)',
  position: 'fixed',
  bottom: 'var(--safe-area-inset-bottom)',
  zIndex: 10,
  alignItems: 'center',
  justifyContent: 'space-around',
  boxShadow: themeShadows.tabBar,
  background: themeColors.lightOverlay,
  transition: 'display 0.5s ease-in-out',
  ':before': {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    content: '""',
    zIndex: -1,
  },
}).toString();
