import { css } from 'glamor';
import { themeColors } from '@shopgate/pwa-common/helpers/config';

export const container = css({
  position: 'relative',
  maxHeight: '100%',
  // This needs to be 100vw to compensate a chrome 80 bug - see related ticket / pr. (PWA-2509)
  // commented out for now since it causes issues in the responsive layout
  // width: '100vw',

}).toString();

export const innerContainer = css({
  overflow: 'hidden',
  '--swiper-navigation-color': themeColors.gray,
  ' .swiper-wrapper': {
    alignItems: 'stretch',
  },
  ' .swiper-slide': {
    height: 'auto',
  },
  ' .swiper-pagination': {
    ' .swiper-pagination-bullet': {
      background: themeColors.gray,
      opacity: '.5',
      margin: '0 4px',
      transition: 'opacity 300ms cubic-bezier(0.25, 0.1, 0.25, 1)',
      border: `1px solid ${themeColors.dark}`,
    },
    ' .swiper-pagination-bullet-active.swiper-pagination-bullet-active-main': {
      opacity: 1,
    },
  },
  ' .swiper-pagination-fraction': {
    top: 'var(--swiper-pagination-fraction-top-offset, 4px)',
    left: 'auto',
    right: 0,
    bottom: 'auto',
    fontSize: 12,
    background: themeColors.background,
    borderRadius: '50px',
    width: 'fit-content',
    padding: '4px 8px',
    margin: '4px 16px',
    transition: 'opacity 300ms cubic-bezier(0.25, 0.1, 0.25, 1)',
  },
  ' .swiper-pagination-progressbar': {
    background: themeColors.shade7,
    ' .swiper-pagination-progressbar-fill': {
      background: themeColors.dark,
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
  // Hide original SwiperJS chevron
  ':after': {
    color: 'transparent',
  },
}).toString();

export const buttonPrev = css({
  backgroundImage: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M0%2C22L22%2C0l2.1%2C2.1L4.2%2C22l19.9%2C19.9L22%2C44L0%2C22L0%2C22L0%2C22z'%20fill%3D'%23808080'%2F%3E%3C%2Fsvg%3E\") !important",
  // Hide original SwiperJS chevron
  ':after': {
    color: 'transparent',
  },
}).toString();
