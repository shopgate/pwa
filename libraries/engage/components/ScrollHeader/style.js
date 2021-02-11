import { css } from 'glamor';

export const header = css({
  position: 'sticky',
  top: 0,
  left: 0,
  zIndex: 2,
  transform: 'translateY(0)',
  transition: 'transform 0.3s ease',
}).toString();

export const hidden = css({
  transform: 'translateY(-100%)',
}).toString();
