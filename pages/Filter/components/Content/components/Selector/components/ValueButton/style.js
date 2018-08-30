import { css } from 'glamor';

export const inactive = css({
  display: 'flex',
  border: '1px solid #ebebeb',
  borderRadius: 2,
  height: 42,
  lineHeight: 1,
  marginLeft: 8,
  marginBottom: 8,
  maxWidth: '100%',
  minWidth: 42,
  outline: 0,
  overflow: 'hidden',
  padding: '0 8px',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const active = css(inactive, {
  borderColor: '#5ccee3',
  color: '#5ccee3',
});
