import { css } from 'glamor';

const outer = css({
  boxSizing: 'content-box',
  minHeight: 44,
  paddingTop: 'var(--safe-area-inset-top)',
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
