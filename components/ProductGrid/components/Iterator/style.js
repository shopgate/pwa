import { css } from 'glamor';

const item = css({
  width: '50%',
  ':nth-child(odd)': {
    paddingRight: 8,
  },
  ':nth-child(even)': {
    paddingLeft: 8,
  },
}).toString();

export default {
  item,
};
