import { css } from 'glamor';

/**
 * Creates a class name for the flex-grow property
 * @param {number} [value=0] The value for the flex-grow property
 * @return {string} The class name
 */
const grow = (value = 0) => css({
  flexGrow: value,
}).toString();

/**
 * Creates a class name for the flex-shrink property
 * @param {number} [value=0] The value for the flex-shrink property
 * @return {string} The class name
 */
const shrink = (value = 1) => css({
  flexShrink: value,
}).toString();

export default {
  grow,
  shrink,
};
