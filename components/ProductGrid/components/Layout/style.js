import { css } from 'glamor';
import { responsiveMediaQuery } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors, variables } = themeConfig;

/**
 * Generate css for grid view
 * @param {number} columns .
 * @returns {string}
 */
export const styles = columns => css({
  [responsiveMediaQuery('<=xs')]: {
    ':not(:empty)': {
      paddingBottom: 2,
    },
  },
  [responsiveMediaQuery('>xs', { webOnly: true })]: {
    padding: variables.gap.big,
  },
  background: `var(--page-background-color, '${colors.background}')`,
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
    },
  },
  ...columns > 2 && {
    display: 'grid',
    gridGap: '4px',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
  },
}).toString();
