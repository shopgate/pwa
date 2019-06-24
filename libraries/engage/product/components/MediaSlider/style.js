import { css } from 'glamor';

export const full = css({
  width: '100%',
  height: '100%',
});

export const container = css({
  ...full,
  position: 'relative',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
}).toString();
