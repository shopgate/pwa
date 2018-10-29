import { css } from 'glamor';
import colors from 'Styles/colors';

export const IMAGE_SPACE = 72;

const gap = 20;

const item = css({
  '&:first-child': {
    boxShadow: `0 -1px 0 0 ${colors.darkGray}, 0 1px 0 0 ${colors.darkGray}`,
  },
  margin: `0 ${gap}px`,
  boxShadow: `0 1px 0 0 ${colors.darkGray}`,
  marginBottom: 1,
}).toString();

const itemWithImage = css({
  marginLeft: IMAGE_SPACE,
}).toString();

const innerContainer = css({
  minHeight: 50,
  position: 'relative',
}).toString();

export default {
  item,
  itemWithImage,
  innerContainer,
};
