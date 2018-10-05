import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

const container = css({
  position: 'absolute',
  top: 0,
  left: 0,
  background: colors.light,
  width: '100%',
  height: '100%',
  zIndex: 1,
}).toString();

/**
 * Creates the content style.
 * @param {boolean} hasNavigator Whether to add the top offset when the navigator is visible.
 * @param {boolean} isFullscreen Whether remove all offsets,
 *                  so that it's really fullscreen (including the notch).
 * @param {number} keyboardHeight The space that is taken by the keyboard.
 * @return {string} The content style class.
 */
const content = (
  hasNavigator = true,
  isFullscreen = false,
  keyboardHeight = 0
) => {
  const navHeight = hasNavigator ? variables.navbar.height : 0;
  const navAndStatusBarHeight = `calc(${navHeight}px + var(--safe-area-inset-top))`;

  /*
    Important: there must be no background-color here.
    If there is background-color applied, on ios10 there is black overlay below the scrollable
    area and all elements without a background.
  */
  return css({
    overflow: 'auto',
    overflowScrolling: 'touch',
    WebkitOverflowScrolling: 'touch',
    width: '100%',
    position: 'absolute',
    top: isFullscreen ? 0 : navAndStatusBarHeight,
    paddingBottom: `calc(var(--tabbar-height) + ${keyboardHeight}px + var(--safe-area-inset-bottom))`,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    ':before': {
      position: 'fixed',
      display: 'block',
      top: 0,
      width: '100%',
      height: isFullscreen ? 0 : navAndStatusBarHeight,
      zIndex: 3,
      content: '""',
      transition: 'box-shadow 100ms cubic-bezier(0.25, 0.1, 0.25, 1)',
    },
  }).toString();
};

const contentShaded = css({
  ':before': {
    boxShadow: variables.navigator.shadow,
  },
}).toString();

export default {
  container,
  content,
  contentShaded,
};
