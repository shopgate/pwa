import { css } from 'glamor';

const grid = css({
  flexWrap: 'wrap',
  padding: '0 15px',
}).toString();

const gridItem = css({
  flexGrow: 1,
  marginBottom: 8,
  minWidth: '50%',
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
