import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

/**
 * Generate css for grid view
 * @param {number} columns .
 * @returns {string}
 */
export const styles = columns => css({
  ':not(:empty)': {
    paddingBottom: 2,
  },
  background: colors.background,
  ...columns <= 2 && {
    ' > *': {
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
    },
  },
  ...columns > 2 && {
    display: 'grid',
    gridGap: '4px',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
  },
}).toString();
