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
});

export default {
  viewport,
  content,
  header,
};
