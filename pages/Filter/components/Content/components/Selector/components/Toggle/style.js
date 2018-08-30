import { css } from 'glamor';

export const toggle = css({
  display: 'flex',
  flexFlow: 'row no-wrap',
  justifyContent: 'space-between',
});

export const label = css({
  alignSelf: 'flex-start',
  textAlign: 'left',
});

export const selected = css({
  alignSelf: 'flex-end',
  textAlign: 'right',
});

export const closed = css({
  fontWeight: 'normal',
});

export const open = css({
  fontWeight: 'bold',
});
