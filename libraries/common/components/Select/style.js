import { css } from 'glamor';

const container = css({
  margin: 0,
  padding: 0,
}).toString();

const selectHandle = css({
  float: 'right',
}).toString();

const items = css({
  position: 'absolute',
  width: '100%',
}).toString();

export default {
  container,
  selectHandle,
  items,
};
