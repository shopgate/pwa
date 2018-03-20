import { css } from 'glamor';

css.global('body', {
  userSelect: 'none',
});

export default css({
  minHeight: '100vh',
  overflowX: 'hidden',
  width: '100vw',
  position: 'relative',
}).toString();
