import { css } from 'glamor';
import colors from 'Styles/colors';

export const IMAGE_SPACE = 56;

const gap = 20;

const container = css({
  margin: `0 ${gap}px`,
  borderBottom: `0.5px ${colors.dividers} solid`,
}).toString();

const item = css({
  position: 'relative',
  borderTop: `0.5px ${colors.dividers} solid`,
  ':empty': {
    borderTop: 'none',
  },
}).toString();

const itemWithImage = css({
  marginLeft: IMAGE_SPACE,
}).toString();

export default {
  container,
  item,
  itemWithImage,
};
