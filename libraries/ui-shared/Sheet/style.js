import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const duration = 300;
const easing = 'cubic-bezier(0.25, 0.1, 0.25, 1)';

const container = css({
  bottom: 0,
  background: themeConfig.colors.light,
  width: '100vw',
  color: themeConfig.colors.dark,
}).toString();

const shadow = css({
  boxShadow: themeConfig.shadows.sheet,
}).toString();

const content = css({
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
  shadow,
  content,
  drawerAnimation,
};
