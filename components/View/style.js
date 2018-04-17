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
  const navHeight = hasNavigator ? variables.navigator.height : 0;

  return css({
    overflow: 'auto',
    overflowScrolling: 'touch',
    WebkitOverflowScrolling: 'touch',
    width: '100%',
    position: 'absolute',
    top: isFullscreen ? 0 : `calc(${navHeight}px + var(--safe-area-inset-top))`,
    paddingBottom: `calc(var(--tabbar-height) + ${keyboardHeight}px + var(--safe-area-inset-bottom))`,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
  }).toString();
};

export default {
  container,
  content,
};
