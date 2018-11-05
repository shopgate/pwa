import { css } from 'glamor';
import variables from 'Styles/variables';

/**
 * Creates the content style.
 * @param {boolean} isFullscreen Whether remove all offsets,
 *                  so that it's really fullscreen (including the notch).
 * @param {number} keyboardHeight The space that is taken by the keyboard.
 * @param {boolean} noScroll Whether the view should be scrollable or not.
 * @return {string} The content style class.
 */
const content = (isFullscreen = false, keyboardHeight = 0, noScroll = false) => {
  const overflow = noScroll ? 'hidden' : 'auto';

  return css({
    overflow,
    overflowScrolling: 'touch',
    WebkitOverflowScrolling: 'touch',
    width: '100vw',
    position: 'absolute',
    top: 0,
    paddingBottom: keyboardHeight,
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
