import { css } from 'glamor';
import variables from 'Styles/variables';

const iconSize = 24;

const buttons = css({
  position: 'absolute',
  right: variables.gap.big,
  top: -30,
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
}).toString();

const favButton = css({
  marginRight: variables.gap.big,
  zIndex: 1, // Prevents the icons to be visible outside of the circle
  fontSize: iconSize,
}).toString();

const ripple = css({
  padding: 8,
}).toString();

export default {
  buttons,
  favButton,
  iconSize,
  ripple,
};
