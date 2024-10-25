import { css } from 'glamor';

export const item = css({
  whiteSpace: 'nowrap',
  flexShrink: 0,
  flexGrow: 0,
  alignSelf: 'flex-end',
});

export const elipsed = css({
  maxWidth: '95%',
  overflow: 'hidden',
  textAlign: 'right',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const comma = css({
  ' + span': {
    marginLeft: '0.65ch',
  },
});
