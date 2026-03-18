import { css } from 'glamor';
import { themeVariables } from '@shopgate/pwa-common/helpers/config';

const outerCircle = css({
  fill: 'var(--color-primary-contrast)',
}).toString();

const innerCircle = css({
  fill: 'currentColor',
  opacity: 0.065,
}).toString();

const heart = css({
  fill: 'var(--color-primary-contrast)',
  stroke: 'currentColor',
  strokeWidth: '4px',
}).toString();

const viewBox = css({
  width: themeVariables.emptyPage.icon,
  color: 'var(--color-primary)',
}).toString();

export default {
  outerCircle,
  innerCircle,
  heart,
  viewBox,
};
