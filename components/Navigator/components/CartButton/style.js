import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

const button = css({
  background: colors.primary,
  fontSize: '1.5rem',
  lineHeight: 1,
  outline: 0,
  padding: 0,
  minWidth: 0,
  width: 0,
  height: variables.navigator.height,
  overflow: 'hidden',
  position: 'relative',
  zIndex: 1,
  transform: 'translate3d(100%, 0, 0)',
  transition: 'transform 300ms cubic-bezier(0.25, 0.1, 0.25, 1), min-width 300ms cubic-bezier(0.25, 0.1, 0.25, 1)',
}).toString();

const buttonContent = css({
  display: 'flex',
  height: '100%',
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  color: colors.primaryContrast,
}).toString();

export default {
  button,
  buttonContent,
};
