import { css } from 'glamor';

const item = css({
  display: 'block',
  position: 'relative',
}).toString();

const unselected = css({
  zIndex: 1,
}).toString();

const selected = css({
  zIndex: 2,
}).toString();

export default {
  item,
  selected,
  unselected,
};
