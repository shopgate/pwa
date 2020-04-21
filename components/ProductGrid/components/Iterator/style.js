import { css } from 'glamor';

/**
 * Styling of the GridItems for variable columns
 * @param {number} columns count of the columns in Grid
 * @return {string}
 */
const item = columns => css({
  paddingTop: 2,
  paddingBottom: 2,
  [`:nth-child(-n+${columns})`]: {
    paddingTop: 0,
  },
  // Flex will add whitespace between items, no padding is needed
  width: `calc(${100 / columns}% - 2px)`,
}).toString();

export default {
  item,
};
