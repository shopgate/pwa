import { css } from 'glamor';

export const container = css({
  position: 'relative',
  maxHeight: '100%',
}).toString();

export const innerContainer = css({
  overflow: 'hidden',
}).toString();

export const wrapper = css({
  flexShrink: 0,
});

export const item = css({
  position: 'relative',
  height: '100%',
});

const bulletBase = {
  width: 8,
  height: 8,
  display: 'inline-block',
  borderRadius: '100%',
  background: '#000',
  opacity: '.2',
  margin: '0 4px',
  transition: 'opacity 300ms cubic-bezier(0.25, 0.1, 0.25, 1)',
};

export const bullet = css(bulletBase).toString(); // needed by ReactIdSwiper

export const bulletActive = css(bulletBase, {
  opacity: '.75',
}).toString(); // needed by ReactIdSwiper
