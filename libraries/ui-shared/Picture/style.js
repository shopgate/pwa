import { css } from 'glamor';

const squareWrapper = {
  position: 'relative',
  ':before': {
    content: '""',
    display: 'block',
    paddingTop: '100%',
  },
};

const squareImage = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  maxHeight: '100%',
};

/**
 * Gets wrapper style.
 * @param {bool} square Image is square.
 * @returns {string}
 */
const getWrapperStyle = (square) => {
  if (!square) {
    return '';
  }

  return css(squareWrapper).toString();
};

/**
 * Gets img style.
 * @param {string} className Default class name.
 * @param {bool} square Image is square.
 * @returns {string}
 */
const getImageStyle = (className, square) => {
  if (!square) {
    return className;
  }

  return `${className} ${css(squareImage).toString()}`;
};

export default {
  getWrapperStyle,
  getImageStyle,
};
