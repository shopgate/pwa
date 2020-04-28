import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

/**
 * Generate css for grid view
 * @param {string} type flex or grid type
 * @param {number} columns .
 * @returns {string}
 */
export const styles = (type, columns) => css({
  ':not(:empty)': {
    paddingBottom: 2,
  },
  background: colors.background,
  ...type === 'flex' && {
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
  ...type === 'grid' && {
    display: 'grid',
    gridGap: '4px',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
  },
}).toString();
