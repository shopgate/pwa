import { css } from 'glamor';

export const details = css({
  lineHeight: 1.2,
  ':not(:empty)': {
    padding: '12px 0 30px',
  },
});

export const quantityHint = css({
  paddingTop: 8,
}).toString();
