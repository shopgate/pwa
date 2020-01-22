import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { shadows } = themeConfig;

const button = css({
  borderRadius: '50%',
  outline: 0,
  overflow: 'hidden',
  padding: 0,
  position: 'relative',
  zIndex: 1,
}).toString();

const buttonSmall = css({
  height: 40,
  width: 40,
});

const buttonLarge = css({
  height: 56,
  width: 56,
});

const buttonShadow = css({
  boxShadow: shadows.buttons.elevated,
});

export default {
  button,
  buttonSmall,
  buttonLarge,
  buttonShadow,
};
