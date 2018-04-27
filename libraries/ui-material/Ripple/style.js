import { css } from 'glamor';

const container = css({
  left: '50%',
  overflow: 'hidden',
  position: 'absolute',
  top: '50%',
  transform: 'translate3d(-50%, -50%, 0)',
  zIndex: 2,
});

const bubble = css({
  borderRadius: '50%',
  opacity: '.15',
  position: 'absolute',
  transform: 'scale3d(0, 0, 1)',
  willChange: 'transform',
  zIndex: 1,
});

export default {
  container,
  bubble,
};
