import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

/**
 * Generate css grid
 * @param {number} columns .
 * @returns {string}
 */
export const grid = columns => css({
  background: colors.light,
  padding: '0 16px',
  ':not(:empty)': {
    marginTop: 16,
  },
  display: 'grid',
  gridGap: '0 8px',
  gridTemplateColumns: `repeat(${columns}, 1fr)`,
}).toString();
