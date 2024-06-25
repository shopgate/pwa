import { css } from 'glamor';

const container = css({
  position: 'fixed',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  overflow: 'hidden',
  zIndex: 2000,
}).toString();

const layout = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
}).toString();

const content = css({
  position: 'relative',
  maxWidth: '100vw',
  maxHeight: '100vh',
  paddingTop: 'var(--safe-area-inset-top)',
  paddingBottom: 'var(--safe-area-inset-bottom)',
  overflowY: 'scroll',
}).toString();

export default {
  container,
  layout,
  content,
};
