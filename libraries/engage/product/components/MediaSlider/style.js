import { css } from 'glamor';

export const full = css({
  width: '100%',
  height: '100%',
  transform: 'translate3d(0, 0, 0)',
});

export const videoWrapper = css({
  width: '100%',
  height: '100%',
  backgroundColor: 'black',
  paddingTop: '22%',
});

export const videoResponsive = css({
  position: 'relative',
  overflow: 'hidden',
  paddingTop: '56.25%',
});

export const video = css({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
});

export const container = css({
  transform: 'translate3d(0, 0, 0)',
  position: 'relative',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
});
