import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { responsiveMediaQuery } from '@shopgate/engage/styles';

const duration = 300;
const easing = 'cubic-bezier(0.25, 0.1, 0.25, 1)';

const section = css({
  [responsiveMediaQuery('>sm', { webOnly: true })]: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    position: 'fixed',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    margin: 'auto',
    zIndex: 100,
  },
}).toString();

const container = css({
  bottom: 0,
  background: themeConfig.colors.light,
  width: '100vw',
  color: `var(--color-text-high-emphasis, ${themeConfig.colors.dark})`,
  [responsiveMediaQuery('>sm', { webOnly: true })]: {
    position: 'initial',
  },
  [responsiveMediaQuery('>md', { webOnly: true })]: {
    width: '60%',
  },
}).toString();

const shadow = css({
  boxShadow: themeConfig.shadows.sheet,
}).toString();

const content = css({
  maxHeight: [
    `calc(var(--vh-100, 100vh) - ${themeConfig.variables.navigator.height}px)`,
    `calc(var(--vh-100, 100vh) - ${themeConfig.variables.navigator.height}px - var(--safe-area-inset-top))`,
  ],
  [responsiveMediaQuery('>sm', { webOnly: true })]: {
    maxHeight: [
      `calc(var(--vh-80, 80vh) - ${themeConfig.variables.navigator.height}px)`,
      `calc(var(--vh-80, 80vh) - ${themeConfig.variables.navigator.height}px - var(--safe-area-inset-top))`,
    ],
  },
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
const fadeInSheetDrawer = css.keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 1 },
});

const slideOutSheetDrawer = css.keyframes({
  '0%': { transform: 'translateY(0)' },
  '100%': { transform: 'translateY(100%)' },
});
const fadeOutSheetDrawer = css.keyframes({
  '0%': { opacity: 1 },
  '100%': { opacity: 0 },
});

const drawerAnimation = {
  in: css({
    [responsiveMediaQuery('<=sm', { appAlways: true })]: {
      animation: `${slideInSheetDrawer} ${duration}ms 1 both ${easing}`,
    },
    [responsiveMediaQuery('>sm', { webOnly: true })]: {
      animation: `${fadeInSheetDrawer} ${duration}ms 1 both ${easing}`,
    },
  }).toString(),
  out: css({
    [responsiveMediaQuery('<=sm', { appAlways: true })]: {
      animation: `${slideOutSheetDrawer} ${duration}ms 1 both ${easing}`,
    },
    [responsiveMediaQuery('>sm', { webOnly: true })]: {
      animation: `${fadeOutSheetDrawer} ${duration}ms 1 both ${easing}`,
    },
  }).toString(),
};

export default {
  section,
  container,
  shadow,
  content,
  drawerAnimation,
};
