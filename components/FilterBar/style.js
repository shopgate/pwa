import { css } from 'glamor';
import variables from 'Styles/variables';

const wrapper = css({
  alignItems: 'center',
  left: 0,
  position: 'fixed',
  width: '100%',
  zIndex: 3,
  transition: 'transform 100ms linear',
  willChange: 'transform',
}).toString();

const shaded = css({
  boxShadow: variables.navigator.shadow,
}).toString();

export default {
  wrapper,
  shaded,
};
