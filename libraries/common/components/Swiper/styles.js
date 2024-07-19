import { css } from 'glamor';
import { themeColors } from '@shopgate/pwa-common/helpers/config';

export const container = css({
  position: 'relative',
  maxHeight: '100%',
  // This needs to be 100vw to compensate a chrome 80 bug - see related ticket / pr.
  width: '100vw',
}).toString();

export const innerContainer = css({
  overflow: 'hidden',
  ' .swiper-wrapper': {
    alignItems: 'stretch',
  },
  ' .swiper-slide': {
    height: 'auto',
  },
  ' .swiper-pagination': {
    transform: 'translate3d(-50%,0,0) !important',
    ' .swiper-pagination-bullet': {
      background: themeColors.gray,
      opacity: '.5',
      margin: '0 4px',
      transition: 'opacity 300ms cubic-bezier(0.25, 0.1, 0.25, 1)',
    },
    ' .swiper-pagination-bullet-active.swiper-pagination-bullet-active-main': {
      opacity: 1,
    },
  },
}).toString();

/**
 * Prevents a visible shrink animation of swiped out slides which where in a zoomed state before.
 */
export const zoomFix = css({
  ' .swiper-slide': {
    overflow: 'hidden',
  },
}).toString();

export const wrapper = css({
  flexShrink: 0,
});

export const buttonNext = css({
  backgroundImage: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M27%2C22L27%2C22L5%2C44l-2.1-2.1L22.8%2C22L2.9%2C2.1L5%2C0L27%2C22L27%2C22z'%20fill%3D'%23808080'%2F%3E%3C%2Fsvg%3E\") !important",
}).toString();

export const buttonPrev = css({
  backgroundImage: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M0%2C22L22%2C0l2.1%2C2.1L4.2%2C22l19.9%2C19.9L22%2C44L0%2C22L0%2C22L0%2C22z'%20fill%3D'%23808080'%2F%3E%3C%2Fsvg%3E\") !important",
}).toString();
