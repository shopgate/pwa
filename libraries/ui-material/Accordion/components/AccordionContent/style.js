import { css } from 'glamor';

export const content = css({
  transform: 'translate3d(0,0,0)',
  transition: 'height 200ms cubic-bezier(0.25, 0.1, 0.25, 1)',
  overflow: 'hidden',
  willChange: 'height',
});

export const contentInner = css({
  padding: '0 16px 16px',
  overflow: 'hidden',
});
