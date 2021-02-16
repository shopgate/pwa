import { css } from 'glamor';

export const header = css({
  transition: 'top 0.6s',
}).toString();

export const hidden = css({
  '&&': {
    top: '-20%',
  },
}).toString();
