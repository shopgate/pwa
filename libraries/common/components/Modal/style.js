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
}).toString();

const layout = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  backgroundColor: themeColors.lightOverlay,
}).toString();

const content = css({
  paddingTop: 'var(--safe-area-inset-top)',
  overflowY: 'scroll',
  position: 'relative',
  maxWidth: '100vw',
  maxHeight: '100vh',
}).toString();

export default {
  container,
  layout,
  content,
};
