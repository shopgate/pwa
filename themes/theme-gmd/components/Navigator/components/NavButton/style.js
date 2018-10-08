import { css } from 'glamor';
import variables from 'Styles/variables';

export default css({
  alignItems: 'center',
  color: 'inherit',
  display: 'flex',
  fontSize: '1.5rem',
  justifyContent: 'center',
  lineHeight: 1,
  outline: 0,
  padding: 0,
  minWidth: variables.navigator.height,
  height: variables.navigator.height,
  position: 'relative',
  zIndex: 1,
}).toString();
