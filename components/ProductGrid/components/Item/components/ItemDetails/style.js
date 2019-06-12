import { css } from 'glamor';

export const details = css({
  lineHeight: 1.2,
  outline: 0,
  ':not(:empty)': {
    padding: '12px 0 30px',
  },
});
