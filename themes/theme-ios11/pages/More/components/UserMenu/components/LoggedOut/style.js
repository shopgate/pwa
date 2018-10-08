import { css } from 'glamor';

const grid = css({
  padding: '0 15px',
  marginBottom: 8,
}).toString();

const gridItem = css({
  width: '50%',
  padding: '0 5px',
}).toString();

const button = css({
  width: '100%',
  ' *': {
    textAlign: 'center',
  },
}).toString();

export default {
  grid,
  gridItem,
  button,
};
