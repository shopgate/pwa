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
  /*
   * Must be here in order to keep CCP-410 fixed.
   * Before there was a left:50%, translateX(-50%) hack for centering the images if ratio is
   * different, but it didn't work since height was not 'auto'.
   * Adding this hack back would cause PWA-660 regression.
   *
   * To fix CCP-410 without shrinking the image and without making PWA-660 back, we should
   * change how the image is rendered by not making it absolute positioned.
   * */
  top: 0,
  left: 0,
  width: '100%',
  maxHeight: '100%',
}).toString();

export default {
  container,
  image,
};
