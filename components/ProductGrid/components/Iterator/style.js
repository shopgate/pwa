import { responsiveMediaQuery } from '@shopgate/engage/styles';
import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

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
  [responsiveMediaQuery('>xs', { webOnly: true })]: {
    padding: variables.gap.small,
    [`:nth-child(${columns}n)`]: {
      paddingRight: variables.gap.big,
    },
    [`:nth-child(${columns}n+1)`]: {
      paddingLeft: variables.gap.big,
    },
    [`:nth-child(-n+${columns})`]: {
      paddingTop: variables.gap.big,
    },
  },
}).toString();

export default {
  item,
};
