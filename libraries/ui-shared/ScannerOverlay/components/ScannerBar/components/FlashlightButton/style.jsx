import { css } from 'glamor';

// TODO SCANNER: style the flashlight button
const button = css({
  alignItems: 'flex-start',
  color: 'inherit',
  display: 'flex',
  fontWeight: 500,
  outline: 0,
  padding: '16px 0',
  position: 'relative',
  width: '100%',
  paddingTop: 'calc(16px + var(--safe-area-inset-top))',
}).toString();

const iconWrapper = css({
  width: 72,
}).toString();

const icon = css({
  boxSizing: 'content-box',
  color: 'blue',
  padding: '0 32px 0 16px',
}).toString();

export default {
  button,
  iconWrapper,
  icon,
};
