import { css } from 'glamor';

const drawer = css({
  width: '100%',
  background: 'black',
  padding: '7px 24px',
  bottom: 'calc(var(--tabbar-height) + var(--safe-area-inset-bottom))',
}).toString();

export default {
  drawer,
};
