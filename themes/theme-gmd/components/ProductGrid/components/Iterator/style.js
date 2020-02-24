import { css } from 'glamor';

/**
 * Styling of the GridItems for variable columns
 * @param {number} columns count of the columns in Grid
 * @return {string}
 */
const item = columns => css({
  [`:nth-child(${columns}n)`]: {
    paddingRight: 0,
  },
  [`:nth-child(${columns}n+1)`]: {
    paddingLeft: 0,
  },
  [`:nth-child(-n+${columns})`]: {
    paddingTop: 0,
  },
  padding: 2,
  width: `${100 / columns}%`,
}).toString();

export default {
  item,
};
