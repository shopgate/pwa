import { css } from 'glamor';
import { themeColors } from '@shopgate/pwa-common/helpers/config';

const container = css({
  display: 'flex',
  justifyContent: 'center',
  flexGrow: 0,
  flexShrink: 0,
  fontSize: '1.75rem !important',
  background: themeColors.darkOverlay,
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
