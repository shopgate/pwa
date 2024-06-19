import { css } from 'glamor';
import { themeColors } from '@shopgate/pwa-common/helpers/config';

const container = css({
  position: 'fixed',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  overflow: 'hidden',
  zIndex: 2000,
  backgroundColor: themeColors.lightOverlay,
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
