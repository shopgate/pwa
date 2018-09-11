import { css } from 'glamor';

const button = css({
  alignItems: 'flex-start',
  color: 'inherit',
  display: 'flex',
  fontWeight: 500,
  outline: 0,
  padding: '16px 0',
  position: 'relative',
  width: '100%',
  ':first-child': {
    paddingTop: 'calc(16px + var(--safe-area-inset-top))',
  },
}).toString();

const label = css({
  marginTop: 2,
}).toString();

const iconWrapper = css({
  width: 72,
}).toString();

const icon = css({
  boxSizing: 'content-box',
  color: '#747474',
  padding: '0 32px 0 16px',
}).toString();

export default {
  button,
  label,
  iconWrapper,
  icon,
};
