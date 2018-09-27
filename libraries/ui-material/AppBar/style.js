import { css } from 'glamor';

const outer = css({
  boxShadow: 'rgba(0, 0, 0, .117647) 0 1px 6px, rgba(0, 0, 0, .117647) 0 1px 4px',
  left: 0,
  paddingTop: 'var(--safe-area-inset-top)',
  position: 'sticky',
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
