import { css } from 'glamor';
import { themeShadows, themeColors } from '@shopgate/pwa-common/helpers/config';

const buttonProto = {
  display: 'block',
  position: 'relative',
  background: themeColors.light,
  borderRadius: '50%',
  padding: 0,
  fontSize: 20,
  lineHeight: 1,
  color: themeColors.accent,
  outline: 0,
};

const buttonFlat = css(buttonProto).toString();

const button = css({
  ...buttonProto,
  boxShadow: themeShadows.buttons.elevated,
}).toString();

const ripple = css({
  padding: 6,
}).toString();

export default {
  buttonFlat,
  button,
  ripple,
};
