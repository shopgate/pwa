import { css } from 'glamor';
import { themeColors, themeVariables } from '@shopgate/pwa-common/helpers/config';

const outerCircle = css({
  fill: themeColors.light,
}).toString();

const innerCircle = css({
  fill: 'currentColor',
  opacity: 0.065,
}).toString();

const heart = css({
  fill: themeColors.light,
  stroke: 'currentColor',
  strokeWidth: '4px',
}).toString();

const viewBox = css({
  width: themeVariables.emptyPage.icon,
  color: themeColors.primary,
}).toString();

export default {
  outerCircle,
  innerCircle,
  heart,
  viewBox,
};
