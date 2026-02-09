import { css } from 'glamor';
import { themeColors } from '@shopgate/pwa-common/helpers/config';

const wrapper = css({
  bottom: 0,
  position: 'fixed',
  top: 0,
  width: '100%',
  zIndex: 4,
}).toString();

const historyOverlay = css({
  background: themeColors.light,
  position: 'absolute',
  left: 0,
  width: '100%',
  top: 100,
  bottom: 0,
  zIndex: 2,
  overflow: 'hidden',
  outline: 'none',
  padding: 16,
}).toString();

export default {
  wrapper,
  historyOverlay,
};
