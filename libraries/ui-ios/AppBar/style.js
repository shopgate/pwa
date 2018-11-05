import { css } from 'glamor';

const outer = css({
  boxSizing: 'content-box',
  minHeight: 44,
  paddingTop: 'var(--safe-area-inset-top)',
  position: 'relative',
}).toString();

const inner = css({
  display: 'flex',
  flexBasis: 'auto',
  justifyContent: 'space-between',
  position: 'relative',
  zIndex: 1,
}).toString();

export default {
  outer,
  inner,
};
