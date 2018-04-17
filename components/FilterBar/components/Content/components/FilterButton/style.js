import { css } from 'glamor';
import variables from 'Styles/variables';

const button = css({
  color: 'inherit',
  fontSize: '1.5rem',
  lineHeight: 1,
  outline: 0,
  padding: 0,
  minWidth: variables.navigator.height,
  height: variables.filterbar.height,
  position: 'relative',
  zIndex: 1,
}).toString();

const filterButton = css({
  display: 'flex',
}).toString();

const filterButtonLabel = css({
  alignSelf: 'center',
  fontSize: 17,
  lineHeight: 1,
  paddingTop: 1,
}).toString();

const filterButtonRipple = css({
  display: 'flex',
  height: '100%',
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  margin: '0 10px',
  padding: '6px 10px',
}).toString();

const filterIcon = css({
  fontSize: '1.4rem',
  marginRight: 2,
}).toString();

export default {
  button,
  filterButton,
  filterButtonLabel,
  filterButtonRipple,
  filterIcon,
};
