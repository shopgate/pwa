import { css } from 'glamor';
import { useScrollContainer, hasWebBridge } from '@shopgate/engage/core';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { responsiveMediaQuery } from '@shopgate/engage/styles';

const { colors } = themeConfig;
const defaultBackgroundColor = colors.background;

css.global('html', {
  '--page-background-color': defaultBackgroundColor,
  '--app-bar-height': '0px',
});

const viewport = css({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  overflow: useScrollContainer() ? 'hidden' : 'inherit',
  position: 'relative',
  [responsiveMediaQuery('<=xs', { appAlways: true })]: {
    width: '100vw',
  },
});

const content = css({
  flexGrow: 1,
  position: 'relative',
  zIndex: 0,
  ...(hasWebBridge() ? {
    display: 'flex',
    justifyContent: 'center',
  } : {}),
  [responsiveMediaQuery('>xs', { webOnly: true })]: {
    boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.2), 0px 3px 1px rgba(0, 0, 0, 0.12), 0px 2px 2px rgba(0, 0, 0, 0.14)',
    margin: 'auto',
  },
});

const header = css({
  top: 0,
  flexShrink: 1,
  // position: 'relative',
  position: 'sticky',
  zIndex: 1,
});

export default {
  viewport,
  content,
  header,
};
