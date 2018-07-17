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
  top: 0, // Must be here in order to keep CCP-410 fixed.
  left: 0, // Must be here in order to keep CCP-410 fixed.
  width: '100%', // Must be here in order to keep CCP-410 fixed.
  maxHeight: '100%', // Must be here in order to keep CCP-410 fixed.
}).toString();

export default {
  container,
  image,
};
