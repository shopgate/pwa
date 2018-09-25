import { css } from 'glamor';

const outer = css({
  left: 0,
  minHeight: 'calc(56px + var(--safe-area-inset-top))',
  paddingTop: 'var(--safe-area-inset-top)',
  position: 'fixed',
  top: 0,
  width: '100%',
  zIndex: 2,
});

const inner = css({
  display: 'flex',
  position: 'relative',
  zIndex: 1,
});

export default {
  outer,
  inner,
};
