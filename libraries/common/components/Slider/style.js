import { css } from 'glamor';

const sliderContainer = css({
  position: 'relative',
  maxHeight: '100%',
}).toString();

const sliderInnerContainer = css({
  overflow: 'hidden',
}).toString();

const slideWrapper = css({
  flexShrink: 0,
}).toString();

const sliderItem = css({
  position: 'relative',
  height: '100%',
}).toString();

export default {
  sliderContainer,
  sliderInnerContainer,
  slideWrapper,
  sliderItem,
};
