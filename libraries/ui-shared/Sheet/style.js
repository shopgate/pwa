import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const duration = 300;
const easing = 'cubic-bezier(0.25, 0.1, 0.25, 1)';

const container = css({
  bottom: 0,
  background: themeConfig.colors.light,
  color: themeConfig.colors.dark,
  width: '100vw',
  maxWidth: 640,
  left: 0,
  right: 0,
  margin: '0 auto',
}).toString();

const containerFullScreen = css({
  height: '100vh',
});

const searchBarWrapper = css({
  backgroundColor: 'white',
  position: 'sticky',
  width: '100%',
  top: 0,
  zIndex: 2,
});

const shadow = css({
  boxShadow: themeConfig.shadows.sheet,
}).toString();

const content = css({
  position: 'relative',
  maxHeight: [
    `calc(100vh - ${themeConfig.variables.navigator.height}px)`,
    `calc(100vh - ${themeConfig.variables.navigator.height}px - var(--safe-area-inset-top))`,
  ],
  paddingBottom: [
    'var(--safe-area-inset-bottom)',
  ],
  overflowY: 'scroll',
  WebkitOverflowScrolling: 'touch',
}).toString();

const slideInSheetDrawer = css.keyframes({
  '0%': { transform: 'translateY(100%)' },
  '100%': { transform: 'translateY(0)' },
});

const slideOutSheetDrawer = css.keyframes({
  '0%': { transform: 'translateY(0)' },
  '100%': { transform: 'translateY(100%)' },
});

const drawerAnimation = {
  in: css({
    animation: `${slideInSheetDrawer} ${duration}ms 1 both ${easing}`,
  }).toString(),
  out: css({
    animation: `${slideOutSheetDrawer} ${duration}ms 1 both ${easing}`,
  }).toString(),
};

export default {
  container,
  containerFullScreen,
  searchBarWrapper,
  shadow,
  content,
  drawerAnimation,
};
