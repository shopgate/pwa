import { css } from 'glamor';
import { responsiveMediaQuery } from '@shopgate/engage/styles';

export const filters = css({
  top: 0,
  [responsiveMediaQuery('>xs', { webOnly: true })]: {
    top: 64,
  },
  [responsiveMediaQuery('<=xs', { webOnly: true })]: {
    top: 56,
  },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  zIndex: 1000,
}).toString();
