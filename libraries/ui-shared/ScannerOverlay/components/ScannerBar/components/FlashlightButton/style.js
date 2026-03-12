import { css } from 'glamor';

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
  color: 'var(--color-secondary)',
}).toString();

export default {
  button,
  iconWrapper,
  icon,
};
