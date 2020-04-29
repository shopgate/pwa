import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { responsiveMediaQuery } from '@shopgate/engage/styles';

const duration = 300;
const easing = 'cubic-bezier(0.25, 0.1, 0.25, 1)';

const container = css({
  bottom: 0,
  background: themeConfig.colors.light,
  width: '100vw',
  color: themeConfig.colors.dark,
  [responsiveMediaQuery('>sm', { webOnly: true })]: {
    height: '90%',
    width: '80%',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
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
    `calc(100vh - ${themeConfig.variables.navigator.height}px)`,
    `calc(100vh - ${themeConfig.variables.navigator.height}px - var(--safe-area-inset-top))`,
  ],
  [responsiveMediaQuery('>sm', { webOnly: true })]: {
    maxHeight: [
      `calc(100% - ${themeConfig.variables.navigator.height}px)`,
      `calc(100% - ${themeConfig.variables.navigator.height}px - var(--safe-area-inset-top))`,
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
  container,
  shadow,
  content,
  drawerAnimation,
};
