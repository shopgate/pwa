import { css } from 'glamor';
import colors from 'Styles/colors';

const gap = 20;

const item = css({
  marginLeft: gap,
  marginRight: gap,
  borderTop: `0.5px ${colors.dividers} solid`,
  ':last-child': {
    borderBottom: `0.5px ${colors.dividers} solid`,
  },
}).toString();

const innerContainer = css({
  position: 'relative',
}).toString();

export default {
  item,
  innerContainer,
};
