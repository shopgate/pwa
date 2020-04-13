import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;
const defaultBackgroundColor = colors.light;

css.global('html', {
  '--page-background-color': defaultBackgroundColor,
  '--tabbar-height': '0px',
});

const viewport = css({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  overflow: 'hidden',
  position: 'relative',
  width: '100vw',
});

const content = css({
  flexGrow: 1,
  position: 'relative',
  zIndex: 0,
});

const header = css({
  top: 0,
  flexShrink: 1,
  position: 'relative',
  zIndex: 1,
});

export default {
  viewport,
  content,
  header,
};
