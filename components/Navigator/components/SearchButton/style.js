import { css } from 'glamor';
import variables from 'Styles/variables';

const button = css({
  color: 'inherit',
  fontSize: '1.5rem',
  lineHeight: 1,
  outline: 0,
  padding: 0,
  minWidth: variables.navigator.height,
  height: variables.navigator.height,
  position: 'relative',
  zIndex: 1,
}).toString();

const buttonContent = css({
  display: 'flex',
  height: '100%',
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
}).toString();

export default {
  button,
  buttonContent,
};
