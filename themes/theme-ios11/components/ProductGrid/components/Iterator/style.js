import { css } from 'glamor';

/**
 * Styling of the GridItems for variable columns
 * @param {number} columns count of the columns in Grid
 * @return {string}
 */
const item = columns => css({
  // Flex will add whitespace between items, no padding is needed
  width: `calc(${100 / columns}% - 8px)`,
}).toString();

export default {
  item,
};
