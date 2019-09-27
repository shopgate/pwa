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

const srOnly = css({
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
});

export default {
  outerRange,
  range,
  srOnly,
};
