import { css } from 'glamor';

const outer = css({
  left: 0,
  position: 'sticky',
  top: 0,
  width: '100%',
  zIndex: 2,
});

const inner = css({
  background: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(20px)',
  display: 'flex',
  position: 'relative',
  zIndex: 1,
});

export default {
  outer,
  inner,
};
