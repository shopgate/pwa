import { css } from 'glamor';
import { useScrollContainer } from '@shopgate/engage/core';
import { responsiveMediaQuery } from '@shopgate/engage/styles';
import { IS_PAGE_PREVIEW_ACTIVE } from '@shopgate/engage/page/constants';

export default css({
  display: 'flex',
  flexDirection: 'column',
  width: '100vw',
  ...(useScrollContainer() ? {
    bottom: 0,
    top: 0,
    overflowScrolling: 'touch',
    position: 'absolute',
    WebkitOverflowScrolling: 'touch',
    ...(IS_PAGE_PREVIEW_ACTIVE && {
      scrollbarWidth: 'thin',
      backgroundColor: 'var(--page-background-color)',
    }),
  } : {
    height: '100%',
    backgroundColor: 'var(--page-background-color)',
  }),
  [responsiveMediaQuery('>xs', { webOnly: true })]: {
    width: 'var(--page-content-width)',
  },
});
