import { css } from 'glamor';

const item = css({
  ':nth-child(even)': {
    padding: '2px 0 2px 2px',
  },
  ':nth-child(odd)': {
    padding: '2px 2px 2px 0',
  },
  ':first-child': {
    padding: '0 2px 2px 0',
  },
  ':nth-child(2)': {
    padding: '0 0 2px 2px',
  },
  padding: 2,
  width: '50%',
}).toString();

export default {
  item,
};
