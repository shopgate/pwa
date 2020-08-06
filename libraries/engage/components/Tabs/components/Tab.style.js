import { css } from 'glamor';
import { responsiveMediaQuery } from '@shopgate/engage/styles';

export const root = css({
  '&&': {
    maxWidth: 200,
    minWidth: 72,
    position: 'relative',
    boxSizing: 'border-box',
    minHeight: 48,
    flexShrink: 0,
    flexGrow: 1,
    padding: '6px 6px',
    overflow: 'hidden',
    whiteSpace: 'normal',
    textAlign: 'center',
  },
  [responsiveMediaQuery('<=xs', { appAlways: true })]: {
    flexShrink: 1,
    flexGrow: 1,
    flexBasis: 0,
    maxWidth: 'none',
  },
}).toString();

export const wrapper = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  flexDirection: 'column',
}).toString();
