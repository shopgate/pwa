import { css } from 'glamor';
import { DRAWER_BACKGROUND } from './constants';

const drawer = css({
  width: '100%',
  background: DRAWER_BACKGROUND,
  padding: '7px 24px',
  bottom: 'calc(var(--tabbar-height) + var(--safe-area-inset-bottom))',
  zIndex: 2,
}).toString();

export default {
  drawer,
};
