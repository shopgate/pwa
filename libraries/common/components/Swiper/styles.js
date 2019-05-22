import { css } from 'glamor';

export const container = css({
  position: 'relative',
  maxHeight: '100%',
}).toString();

export const innerContainer = css({
  overflow: 'hidden',
  ' .swiper-wrapper': {
    alignItems: 'stretch',
  },
  ' .swiper-slide': {
    height: 'auto',
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

const bulletBase = {
  width: 8,
  height: 8,
  display: 'inline-block',
  borderRadius: '100%',
  background: '#808080',
  opacity: '.5',
  margin: '0 4px',
  transition: 'opacity 300ms cubic-bezier(0.25, 0.1, 0.25, 1)',
};

export const bullet = css(bulletBase).toString(); // needed by ReactIdSwiper

export const bulletActive = css(bulletBase, {
  opacity: '1',
}).toString(); // needed by ReactIdSwiper
