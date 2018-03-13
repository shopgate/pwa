import { css } from 'glamor';

const ripple = css({
  position: 'absolute',
  borderRadius: '50%',
  transformOrigin: '50% 50% 0',
}).toString();

const container = css({
  position: 'absolute',
  zIndex: 0,
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
}).toString();

export default {
  ripple,
  container,
};
