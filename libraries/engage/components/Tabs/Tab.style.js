import { css } from 'glamor';
import { responsiveMediaQuery } from '@shopgate/engage/styles';

export const root = css({
  maxWidth: 264,
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
  [responsiveMediaQuery('>=sm', { webOnly: true })]: {
    padding: '6px 24px',
    minWidth: 160,
    flexGrow: 0,
  },
  color: 'inherit',
}).toString();

export const wrapper = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  flexDirection: 'column',
}).toString();
