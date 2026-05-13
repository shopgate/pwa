import { css } from 'glamor';
import { useScrollContainer, isIOs } from '@shopgate/engage/core/helpers';
import { responsiveMediaQuery } from '@shopgate/engage/styles';
import { IS_PAGE_PREVIEW_ACTIVE } from '@shopgate/engage/page/constants';

export const container = css({
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

export const containerInner = css({
  display: 'flex',
  flexGrow: 1,
  flexDirection: 'column',
  ...isIOs && useScrollContainer() ? {
    // Make the scroll container content a bit higher than the actual scroll container to
    // get a rubber band effect in all situations
    minHeight: 'calc(100% + var(--extra-ios-scroll-space, 0px))',
  } : {},
  ':after': {
    content: "''",
    display: 'block',
    pointerEvents: 'none',
    paddingBottom: 'calc(var(--page-content-offset-bottom) + var(--keyboard-height))',
  },
});

export const scrollableContent = css({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
});
