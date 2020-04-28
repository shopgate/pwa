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
  background: colors.light,
  padding: '0 16px',
  ':not(:empty)': {
    marginTop: 16,
  },
  ...type === 'flex' && {
    ' > *': {
      [`:nth-child(${columns}n)`]: {
        paddingRight: 0,
      },
      [`:nth-child(${columns}n+1)`]: {
        paddingLeft: 0,
      },
      padding: '0px 8px',
      width: `${100 / columns}%`,
    },
  },
  ...type === 'grid' && {
    display: 'grid',
    gridGap: '0 16px',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
  },
}).toString();
