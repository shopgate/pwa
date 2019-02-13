import { css } from 'glamor';

const outer = css({
  boxSizing: 'content-box',
  paddingTop: 'var(--safe-area-inset-top)',
  position: 'sticky',
  left: 0,
  top: 0,
  width: '100%',
  zIndex: 15,
});

const inner = css({
  display: 'flex',
  justifyContent: 'space-between',
  position: 'relative',
  zIndex: 14,
});

export default {
  outer,
  inner,
};
