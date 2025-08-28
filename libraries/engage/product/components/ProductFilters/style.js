import { css } from 'glamor';
import { useScrollContainer } from '@shopgate/engage/core';
import { responsiveMediaQuery } from '@shopgate/engage/styles';

export const filters = css({
  ...(useScrollContainer() ? { top: 0 } : { top: 44 }),
  [responsiveMediaQuery('>xs', { webOnly: true })]: {
    top: 64,
    marginBottom: 16,
  },
  [responsiveMediaQuery('<=xs', { webOnly: true })]: {
    top: 56,
  },
  display: 'block',
  zIndex: 1000,
}).toString();
