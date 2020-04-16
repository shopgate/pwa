import { css } from 'glamor';
import { themeShadows, themeColors } from '@shopgate/pwa-common/helpers/config';

export const contentStyle = css({
  fontSize: 14,
  height: '100%',
  overflowY: 'scroll',
  paddingBottom: 'var(--safe-area-inset-bottom)',
  WebkitOverflowScrolling: 'touch',
});

export const drawerStyle = css({
  background: themeColors.light,
  boxShadow: themeShadows.navDrawer,
  color: themeColors.dark,
  height: '100vh',
  left: 0,
  maxWidth: '300px',
  position: 'fixed',
  top: 0,
  transition: 'transform 300ms cubic-bezier(0.25, 0.1, 0.25, 1)',
  width: '100%',
  willChange: 'transform',
  zIndex: 50,
  '@media(max-width: 480px)': {
    maxWidth: '67vw',
  },
});
