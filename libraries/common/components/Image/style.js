import { css } from 'glamor';

/**
 * @param {string} [background='#f2f2f2'] The background color.
 * @param {string} [paddingTop='100%'] The padding top value.
 * @returns {string} The compiled class names.
 */
const container = (background = '#f2f2f2', paddingTop = '100%') => css({
  position: 'relative',
  background,
  zIndex: 0,
  ':before': {
    display: 'block',
    content: '""',
    width: '100%',
    paddingTop,
  },
}).toString();

const image = css({
  position: 'absolute',
  left: '50%',
  maxHeight: '100%',
  top: '50%',
  transform: 'translate3d(-50%, -50%, 0)',
  width: '100%',
}).toString();

export default {
  container,
  image,
};
