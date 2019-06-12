import { css } from 'glamor';

export const details = css({
  lineHeight: 1.35,
  outline: 0,
  ':not(:empty)': {
    padding: '12px 16px',
  },
});

export const title = css({
  fontWeight: '500',
  lineHeight: 1.15,
  marginTop: 1,
  wordBreak: ['keep-all', 'break-word'],
  hyphens: 'auto',
});
