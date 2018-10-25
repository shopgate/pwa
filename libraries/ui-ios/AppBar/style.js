import { css } from 'glamor';

const outer = css({
  backdropFilter: 'blur(30px)',
  left: 0,
  position: 'sticky',
  top: 0,
  width: '100%',
  zIndex: 2,
});

const inner = css({
  display: 'flex',
  justifyContent: 'space-between',
  position: 'relative',
  zIndex: 1,
});

export default {
  outer,
  inner,
};
