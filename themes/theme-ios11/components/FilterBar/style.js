import { css } from 'glamor';

const wrapper = css({
  alignItems: 'center',
  left: 0,
  position: 'fixed',
  width: '100%',
  zIndex: 3,
  transition: 'transform 100ms linear',
  willChange: 'transform',
}).toString();

export default {
  wrapper,
};
