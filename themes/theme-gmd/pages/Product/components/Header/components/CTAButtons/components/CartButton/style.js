import { css } from 'glamor';

export const button = css({
  transition: 'background 400ms cubic-bezier(0.4, 0.0, 0.2, 1)',
}).toString();

export const hidden = css({
  clip: 'rect(1px, 1px, 1px, 1px)',
  height: '1px',
  margin: 0,
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: '1px',
  zIndex: -1000,
}).toString();
