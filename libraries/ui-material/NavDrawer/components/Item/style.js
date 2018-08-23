import { css } from 'glamor';

const button = css({
  alignItems: 'flex-start',
  display: 'flex',
  fontWeight: 500,
  outline: 0,
  padding: '16px 0',
  position: 'relative',
  width: '100%',
  ':first-child': {
    paddingTop: 'var(--safe-area-inset-top)',
  },
}).toString();

const icon = css({
  boxSizing: 'content-box',
  color: '#747474',
  padding: '0 32px 0 16px',
}).toString();

export default {
  button,
  icon,
};
