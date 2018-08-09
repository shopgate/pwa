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
 * @param {bool} square Image is square.
 * @returns {string}
 */
const getImageStyle = (square) => {
  if (!square) {
    return '';
  }

  return css(squareImage).toString();
};

export default {
  getWrapperStyle,
  getImageStyle,
}