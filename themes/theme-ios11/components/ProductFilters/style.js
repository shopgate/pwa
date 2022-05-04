import { css } from 'glamor';
import { responsiveMediaQuery } from '@shopgate/engage/styles';
import { useScrollContainer } from '@shopgate/engage/core';

export const filters = css({
  ...(useScrollContainer() ? { top: 0 } : { top: 44 }),
  [responsiveMediaQuery('>xs', { webOnly: true })]: {
    top: 64,
  },
  [responsiveMediaQuery('<=xs', { webOnly: true })]: {
    top: 44,
  },
  display: 'block',
  zIndex: 1000,
}).toString();
