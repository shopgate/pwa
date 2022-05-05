import { css } from 'glamor';
import { themeColors, themeVariables } from '@shopgate/pwa-common/helpers/config';

const outerCircle = css({
  fill: `var(--color-primary-contrast, ${themeColors.light})`,
}).toString();

const innerCircle = css({
  fill: 'currentColor',
  opacity: 0.065,
}).toString();

const heart = css({
  fill: `var(--color-primary-contrast, ${themeColors.light})`,
  stroke: 'currentColor',
  strokeWidth: '4px',
}).toString();

const viewBox = css({
  width: themeVariables.emptyPage.icon,
  color: `var(--color-primary, ${themeColors.primary})`,
}).toString();

export default {
  outerCircle,
  innerCircle,
  heart,
  viewBox,
};
