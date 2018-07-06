import { css } from 'glamor';
import colors from 'Styles/colors';

const bottom = value => css({
  bottom: value,
}).toString();

const wrapper = css({
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
