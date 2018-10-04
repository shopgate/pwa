import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

export const IMAGE_SPACE = 72;

const item = css({
  marginLeft: variables.gap.big,
}).toString();

const itemNotLast = css({
  boxShadow: `0 1px 0 0 ${colors.darkGray}`,
  marginBottom: 1,
}).toString();

const itemWithImage = css({
  marginLeft: IMAGE_SPACE,
}).toString();

const innerContainer = css({
  minHeight: 56,
  position: 'relative',
}).toString();

const glow = css({
  bottom: -1,
  height: '100%',
  top: -1,
}).toString();

export default {
  item,
  itemNotLast,
  itemWithImage,
  innerContainer,
  glow,
};
