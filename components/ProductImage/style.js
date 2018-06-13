import { css } from 'glamor';

const placeholderIconScale = 0.65;
const placeholderDimension = placeholderIconScale * 100;
const placeholderOffset = (1.0 - placeholderIconScale) * 50;

const container = css({
  position: 'relative',
  overflow: 'hidden',
}).toString();

const glowContainer = css({
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  boxShadow: 'inset 0 0 20px rgba(0, 0, 0, .05)',
  zIndex: 1,
  pointerEvents: 'none',
}).toString();

const placeholderContainer = css({
  position: 'relative',
  width: '100%',
  ':before': {
    display: 'block',
    content: '""',
    width: '100%',
    paddingTop: '100%',
  },
}).toString();

const placeholderContent = css({
  position: 'absolute',
  width: '100%',
  height: '100%',
  top: 0,
  padding: '1em',
  textAlign: 'center',
}).toString();

const placeholder = css({
  position: 'absolute',
  width: `${placeholderDimension}% !important`,
  height: `${placeholderDimension}% !important`,
  top: `${placeholderOffset}%`,
  left: `${placeholderOffset}%`,
  color: 'rgba(0, 0, 0, .05)',
}).toString();

export default {
  container,
  glowContainer,
  placeholderContainer,
  placeholderContent,
  placeholder,
};
