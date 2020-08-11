import { css } from 'glamor';

export const header = css({
  top: 0,
  left: 0,
  display: 'flex',
  backgroundColor: '#fff',
  transform: 'translateY(0)',
  transition: 'transform 0.3s ease',
}).toString();

export const hidden = css({
  transform: 'translateY(-110%)',
}).toString();

export const visible = css({
  position: 'sticky',
}).toString();

