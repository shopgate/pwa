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
    ':nth-child(even)': {
      padding: `0 0 ${variables.gap.big}px ${variables.gap.small}px`,
    },
    ':nth-child(odd)': {
      padding: `0 ${variables.gap.small}px ${variables.gap.big}px 0`,
    },
    '&:nth-child(2n+1):nth-last-child(-n+2), &:nth-child(2n+1):nth-last-child(-n+2) ~ li': {
      paddingBottom: 0,
    },
  },
}).toString();

export default {
  item,
};
