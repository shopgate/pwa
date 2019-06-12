import { css } from 'glamor';

export const hidden = css({
  display: 'none',
});

export const headline = css({
  clip: 'rect(1px, 1px, 1px, 1px)',
  height: '1px',
  margin: 0,
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: '1px',
  zIndex: -1000,
});
