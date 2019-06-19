import { css } from 'glamor';

export const placeholderContainer = css({
  position: 'relative',
  width: '100%',
  ':before': {
    display: 'block',
    content: '""',
    width: '100%',
    paddingTop: '100%',
  },
}).toString();

export const placeholderContent = css({
  position: 'absolute',
  width: '100%',
  height: '100%',
  top: 0,
  textAlign: 'center',
}).toString();

const placeholderIconScale = 0.65;

export const placeholderIcon = css({
  position: 'absolute',
  width: `${placeholderIconScale * 100}% !important`,
  height: `${placeholderIconScale * 100}% !important`,
  top: `${(1.0 - placeholderIconScale) * 50}%`,
  left: `${(1.0 - placeholderIconScale) * 50}%`,
  color: 'rgba(0, 0, 0, .05)',
}).toString();

export const innerShadow = css({
  position: 'relative',
  overflow: 'hidden',
  ':after': {
    display: 'block',
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    boxShadow: 'inset 0 0 20px rgba(0, 0, 0, .05)',
    pointerEvents: 'none',
  },
}).toString();
