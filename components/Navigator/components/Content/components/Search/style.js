import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

const container = css({
  flexGrow: 1,
}).toString();

const input = css({
  width: '100%',
  fontSize: '1rem',
  border: `1px ${colors.shade7} solid`,
  padding: `0 ${variables.gap.big}px`,
  background: colors.light,
  height: '46px',
  borderRadius: '2px',
  outline: 'none',
  position: 'relative',
  WebkitAppearance: 'none',
  zIndex: 11,
}).toString();

const overlay = css({
  height: variables.navigator.height,
  left: 0,
  position: 'fixed',
  top: 0,
  right: 56,
  zIndex: 10,
}).toString();

export default {
  container,
  input,
  overlay,
};
