import { css } from 'glamor';
import colors from 'Styles/colors';

/**
 * Manipulates the css when keyboard is opened to keep the UI scrollable.
 * @param {number} value Keyboard overlap value.
 * @returns {string}
 */
const bottom = value => css({
  paddingBottom: value,
}).toString();

const wrapper = css({
  bottom: 0,
  position: 'absolute',
  left: 0,
  right: 0,
  top: 124,
  backgroundColor: colors.light,
  overflowY: 'scroll',
  zIndex: 3,
  borderTop: `0.5px ${colors.dividers} solid`,
  paddingTop: 5,
}).toString();

export default {
  bottom,
  wrapper,
};
