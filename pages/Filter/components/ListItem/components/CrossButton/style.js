import { css } from 'glamor';
import colors from 'Styles/colors';

const cross = css({
  width: 40,
  height: 40,
  position: 'absolute',
  top: 5,
  right: 0,
  zIndex: 1,
  fontSize: '1.5rem',
  color: colors.accent,
  lineHeight: 1,
  outline: 0,
  padding: 0,
}).toString();

const crossIcon = css({
  margin: 'auto',
}).toString();

export default {
  cross,
  crossIcon,
};
