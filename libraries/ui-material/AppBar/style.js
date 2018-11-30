import { css } from 'glamor';

const outer = css({
  boxSizing: 'content-box',
  left: 0,
  paddingTop: 'var(--safe-area-inset-top)',
  position: 'sticky',
  top: 0,
  width: '100%',
  zIndex: 15,
});

const inner = css({
  background: 'inherit',
  display: 'flex',
  position: 'relative',
  zIndex: 14,
});

export default {
  outer,
  inner,
};
