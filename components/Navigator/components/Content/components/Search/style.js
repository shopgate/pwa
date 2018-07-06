import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

const container = css({
  height: variables.navigator.height,
  left: 0,
  padding: '5px 0',
  position: 'absolute',
  top: 0,
  width: '100%',
}).toString();

const form = css({
  height: '100%',
}).toString();

const input = css({
  width: '100%',
  fontSize: '1rem',
  border: `1px ${colors.shade7} solid`,
  padding: `0 ${variables.gap.big}px`,
  background: colors.light,
  height: '100%',
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
  form,
  input,
  overlay,
};
