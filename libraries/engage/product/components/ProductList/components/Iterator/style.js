import { css } from 'glamor';

const item = css({
  ':first-child': {
    paddingTop: 0,
  },
  ':last-child': {
    paddingBottom: 4,
  },
  paddingTop: 2,
  paddingBottom: 2,
  position: 'relative',
}).toString();

export default {
  item,
};
