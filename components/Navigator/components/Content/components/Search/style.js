import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

const container = css({
  left: 0,
  top: 5,
  position: 'absolute',
  transition: 'transform 150ms cubic-bezier(0.25, 0.1, 0.25, 1)',
  width: '100%',
  willChange: 'transform',
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
  WebkitAppearance: 'none',
}).toString();

const overlay = css({
  position: 'fixed',
  left: -variables.navigator.height,
  top: variables.navigator.height,
  width: '100vw',
  height: '100vh',
  background: 'transparent',
  zIndex: 10,
}).toString();

export default {
  container,
  input,
  overlay,
};
