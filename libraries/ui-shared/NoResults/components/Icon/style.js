import { css } from 'glamor';
import { themeColors } from '@shopgate/pwa-common/helpers/config';

const magnifier = css({
  fill: 'currentColor',
}).toString();

const background = css({
  fill: themeColors.light,
}).toString();

const circle = css({
  fill: 'currentColor',
  opacity: 0.065,
}).toString();

export default {
  magnifier,
  background,
  circle,
};
