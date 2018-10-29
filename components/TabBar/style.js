import { css } from 'glamor';
import variables from 'Styles/variables';

const { style } = document.documentElement;
const backgroundColor = 'rgba(249, 249, 249, 0.9)';

/**
 * Sets a global css variable that indicates the current height of the TabBar
 * @param {boolean} isVisible The current visiblity state
 */
export const updateHeightCSSProperty = (isVisible) => {
  const value = `${isVisible ? variables.tabBar.height : 0}px`;
  /**
   * Update the css property with the correct value. Glamor can't be used here,
   * since it's not capable to update variables within the global scope.
   */
  if (style.getPropertyValue('--tabbar-height') !== value) {
    style.setProperty('--tabbar-height', value);
  }

  console.warn(value);
};

export default css({
  position: 'sticky',
  bottom: 0,
  left: 0,
  right: 0,
  height: 'calc(var(--tabbar-height) + var(--safe-area-inset-bottom))',
  paddingBottom: 'var(--safe-area-inset-bottom)',
  zIndex: 10,
  alignItems: 'center',
  justifyContent: 'space-around',
  boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.1)',
  ':before': {
    ...variables.blur,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    content: '""',
    background: backgroundColor,
    zIndex: -1,
  },
}).toString();
