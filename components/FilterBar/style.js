import { css } from 'glamor';
import variables from 'Styles/variables';

const wrapper = css({
  alignItems: 'center',
  left: 0,
  position: 'fixed',
  width: '100%',
  zIndex: 3,
  transition: 'transform 200ms cubic-bezier(0.25, 0.1, 0.25, 1)',
}).toString();

const shaded = css({
  boxShadow: variables.navigator.shadow,
}).toString();

export default {
  wrapper,
  shaded,
};
