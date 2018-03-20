import { css } from 'glamor';
import colors from 'Styles/colors';

export default css({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 124,
  bottom: 0,
  backgroundColor: colors.light,
  overflowY: 'scroll',
  zIndex: 3,
  borderTop: `0.5px ${colors.dividers} solid`,
  paddingTop: 5,
}).toString();
