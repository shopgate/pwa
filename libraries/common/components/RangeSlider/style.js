import { css } from 'glamor';

const outerRange = css({
  minHeight: 1,
  position: 'relative',
}).toString();

const range = css({
  left: 0,
  right: 0,
  position: 'absolute',
}).toString();

export default {
  outerRange,
  range,
};
