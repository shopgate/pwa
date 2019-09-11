import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const buttonProto = {
  display: 'block',
  position: 'relative',
  background: '#fff',
  borderRadius: '50%',
  padding: 0,
  fontSize: 20,
  lineHeight: 1,
  color: themeConfig.colors.accent,
  outline: 0,
};

const buttonFlat = css(buttonProto).toString();

const button = css({
  ...buttonProto,
  boxShadow: themeConfig.shadows.buttons.elevated,
}).toString();

const ripple = css({
  padding: 6,
}).toString();

export default {
  buttonFlat,
  button,
  ripple,
};
