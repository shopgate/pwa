import { css } from 'glamor';
import variables from 'Styles/variables';

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
  return css({
    overflow: 'auto',
    overflowScrolling: 'touch',
    WebkitOverflowScrolling: 'touch',
    width: '100%',
    position: 'absolute',
    top: 'var(--safe-area-inset-top)',
    paddingBottom: `calc(var(--tabbar-height) + ${keyboardHeight}px + var(--safe-area-inset-bottom))`,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    ':before': {
      position: 'fixed',
      display: 'block',
      top: 0,
      width: '100%',
      height: isFullscreen ? 0 : 'var(--safe-area-inset-top)',
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
  content,
  contentShaded,
};
