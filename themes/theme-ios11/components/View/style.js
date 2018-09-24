import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

const container = css({
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
 * @param {boolean} considerPaddingTop Whether to consider the natively set inset
 *                  and compensate it or not.
 * @param {boolean} noScroll Wheather the view should be scrollable or not.
 * @return {string} The content style class.
 */
const content = (
  hasNavigator = true,
  isFullscreen = false,
  considerPaddingTop = false,
  noScroll = false
) => {
  const navHeight = hasNavigator ? variables.navbar.height : 0;
  const overflow = noScroll ? 'hidden' : 'auto';

  return css({
    overflow,
    overflowScrolling: 'touch',
    WebkitOverflowScrolling: 'touch',
    width: '100%',
    position: 'absolute',
    top: isFullscreen ? 0 : `calc(${navHeight}px + var(--safe-area-inset-top))`,
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: 'calc(var(--tabbar-height) + var(--safe-area-inset-bottom))',
    bottom: 0,
    ...considerPaddingTop && {
      marginBottom: 'calc(var(--tabbar-height) + var(--safe-area-inset-bottom))',
    },
  }).toString();
};

export default {
  container,
  content,
};
