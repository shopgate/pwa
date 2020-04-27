import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

/**
 * Generate css grid
 * @param {number} columns .
 * @returns {string}
 */
export const grid = columns => css({
  ':not(:empty)': {
    paddingBottom: 2,
  },
  background: colors.background,
  display: 'grid',
  gridGap: '2px',
  gridTemplateColumns: `repeat(${columns}, 1fr)`,
}).toString();
