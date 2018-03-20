import { css } from 'glamor';
import variables from 'Styles/variables';

const outerBorder = css({
  fill: '#fff',
}).toString();

const innerBorder = css({
  fill: '#d0f4fa',
  opacity: 0.566,
}).toString();

const mainCircle = css({
  fill: '#5ccee3',
  opacity: 0.292,
}).toString();

const heart = css({
  fill: '#fff',
  stroke: '#5ccee3',
  strokeWidth: '4px',
}).toString();

const heartGroup = css({
  filter: 'url(#shadow)',
}).toString();

const viewBox = css({
  width: variables.emptyPage.icon,
}).toString();

export default {
  outerBorder,
  innerBorder,
  mainCircle,
  heart,
  heartGroup,
  viewBox,
};
