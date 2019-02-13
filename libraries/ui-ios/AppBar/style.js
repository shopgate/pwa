import { css } from 'glamor';

const outer = css({
  boxSizing: 'content-box',
  left: 0,
  paddingTop: 'var(--safe-area-inset-top)',
  position: 'sticky',
  top: 0,
  width: '100%',
  zIndex: 15,
}).toString();

const inner = css({
  display: 'flex',
  justifyContent: 'space-between',
  position: 'relative',
  zIndex: 14,
}).toString();

export default {
  outer,
  inner,
};
