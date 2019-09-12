import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const container = css({
  position: 'relative',
}).toString();

const button = css({
  display: 'block',
  fontSize: '1.5rem',
  outline: 0,
  padding: 0,
}).toString();

const overlay = css({
  position: 'fixed',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  zIndex: 10,
}).toString();

const menu = css({
  position: 'absolute',
  top: 0,
  left: 0,
  padding: `${themeConfig.variables.gap.small}px 0`,
  minWidth: 130,
  background: themeConfig.colors.light,
  borderRadius: 2,
  boxShadow: themeConfig.shadows.contextMenu,
}).toString();

export default {
  container,
  button,
  menu,
  overlay,
};
