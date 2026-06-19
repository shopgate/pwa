import { css } from 'glamor';
import { useScrollContainer, hasWebBridge } from '@shopgate/engage/core';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;
const defaultBackgroundColor = colors.light;

css.global('html', {
  '--page-background-color': defaultBackgroundColor,
  '--tabbar-height': '0px',
  '--app-bar-height': '0px',
});

const viewport = css({
  display: 'flex',
  flexDirection: 'column',
  minHeight: [
    '100vh',
    //    'var(--vh-100, 100vh)',
  ],
  overflow: useScrollContainer() ? 'hidden' : 'inherit',
  position: 'relative',
  width: '100vw',
});

const content = css({
  flexGrow: 1,
  position: 'relative',
  zIndex: 0,
  ...(hasWebBridge() ? {
    display: 'flex',
    justifyContent: 'center',
  } : {}),
});

const header = css({
  top: 0,
  flexShrink: 1,
  position: hasWebBridge() ? 'sticky' : 'relative',
  zIndex: 1,
  // Reserve one AppBar's height (the ui-ios AppBar minHeight of 44 plus the top
  // safe-area inset it pads by) so the header never collapses to 0 while it is
  // momentarily empty during a route transition. The outgoing page's AppBar
  // unmounts the instant its route turns invisible, but the outgoing content
  // lingers for the view crossfade and the incoming page's AppBar only appears
  // after that page's cold first-render mounts; without this floor the in-flow
  // header collapses in that gap and the still-visible content jumps upward.
  minHeight: 'calc(44px + var(--safe-area-inset-top))',
});

export default {
  viewport,
  content,
  header,
};
