import { css } from 'glamor';

export const root = css({
  maxWidth: 200,
  minWidth: 72,
  position: 'relative',
  boxSizing: 'border-box',
  minHeight: 48,
  flexShrink: 0,
  flexGrow: 1,
  padding: '6px 12px',
  overflow: 'hidden',
  whiteSpace: 'normal',
  textAlign: 'center',
}).toString();

export const wrapper = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  flexDirection: 'column',
}).toString();
