import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const button = css({
  alignItems: 'center',
  color: 'inherit',
  display: 'flex',
  flexShrink: 0,
  fontSize: 24,
  height: 44,
  justifyContent: 'center',
  outline: 0,
  padding: 0,
  position: 'relative',
  width: 44,
  zIndex: 1,
}).toString();

const iconWrapper = css({
  width: 72,
}).toString();

const icon = css({
  boxSizing: 'content-box',
  color: `var(--color-secondary, ${themeConfig.colors.accent})`,
}).toString();

export default {
  button,
  iconWrapper,
  icon,
};
