import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { shadows } = themeConfig;

export const contentStyle = css({
  fontSize: 14,
  height: '100%',
  overflowY: 'scroll',
  paddingBottom: 'var(--safe-area-inset-bottom)',
  WebkitOverflowScrolling: 'touch',
});

export const drawerStyle = css({
  background: '#fff',
  boxShadow: shadows.navDrawer,
  color: '#000',
  height: '100vh',
  left: 0,
  maxWidth: '67vw',
  position: 'fixed',
  top: 0,
  transition: 'transform 300ms cubic-bezier(0.25, 0.1, 0.25, 1)',
  width: '100%',
  willChange: 'transform',
  zIndex: 50,
});
