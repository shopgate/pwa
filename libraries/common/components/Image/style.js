import { css } from 'glamor';
import { themeColors } from '@shopgate/pwa-common/helpers/config';

/**
 * @param {string} [background=themeColors.placeholder] The background color.
 * @param {string} [paddingTop='100%'] The padding top value.
 * @returns {string} The compiled class names.
 */
const container = (background = themeColors.placeholder, paddingTop = '100%') => css({
  background,
  position: 'relative',
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
  top: 0,
  left: 0,
  width: '100%',
  maxHeight: '100%',
  WebkitTouchCallout: 'none',
}).toString();

export default {
  container,
  image,
};
