import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

const outerCircle = css({
  fill: '#fff',
}).toString();

const innerCircle = css({
  fill: 'currentColor',
  opacity: 0.065,
}).toString();

const heart = css({
  fill: '#fff',
  stroke: 'currentColor',
  strokeWidth: '4px',
}).toString();

const viewBox = css({
  width: variables.emptyPage.icon,
  color: colors.primary,
}).toString();

export default {
  outerCircle,
  innerCircle,
  heart,
  viewBox,
};
