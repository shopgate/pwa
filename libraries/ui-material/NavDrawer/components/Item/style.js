import { css } from 'glamor';
import { themeColors } from '@shopgate/pwa-common/helpers/config';

const srOnly = css({
  clip: 'rect(1px, 1px, 1px, 1px)',
  height: '1px',
  margin: 0,
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: '1px',
  zIndex: -1000,
  ':first-child': {
    marginTop: 'calc(16px + var(--safe-area-inset-top))',
  },
}).toString();

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
  color: themeColors.gray,
  padding: '0 32px 0 16px',
}).toString();

export default {
  srOnly,
  button,
  label,
  iconWrapper,
  icon,
};
