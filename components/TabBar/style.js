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

export default css({
  height: 'var(--tabbar-height)',
  position: 'relative',
  zIndex: 10,
  alignItems: 'center',
  justifyContent: 'space-around',
  boxShadow: themeShadows.tabBar,
  background: themeColors.lightOverlay,
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
