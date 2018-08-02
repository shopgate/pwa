import { css } from 'glamor';
import colors from 'Styles/colors';

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
  marginLeft: 56,
}).toString();

export default {
  container,
  item,
  itemWithImage,
};
