import { css } from 'glamor';

const container = css({
  fontSize: '1.75rem !important',
  background: '#f0f0f0',
  transform: 'opacity 300ms cubic-bezier(0.25, 0.1, 0.25, 1) !important',
  outline: 0,
  boxShadow: 'none !important',
  borderRadius: '5px !important',
  width: '46px !important',
  height: '46px !important',
  zIndex: '0 !important',
  color: 'inherit',
  ':active svg': {
    opacity: 0.5,
  },
}).toString();

const icon = css({
  flex: 1,
}).toString();

export default {
  container,
  icon,
};
