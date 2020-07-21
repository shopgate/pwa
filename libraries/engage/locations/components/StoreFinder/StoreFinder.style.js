import { css } from 'glamor';
import { responsiveMediaQuery } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

export const container = css({
  display: 'grid',
  gridTemplateColumns: '300px 1fr',
  gridTemplateRows: '60px 300px 1fr 1fr',
  gridTemplateAreas: `
    "search map"
    "store-list map"
    "store-list store-details"
    "store-list store-details"
  `,
  columnGap: variables.gap.small,
  rowGap: variables.gap.small,
  height: 'calc(100vh - var(--app-bar-height))',
  [responsiveMediaQuery('<=sm', { appAlways: true })]: {
    gridTemplateColumns: '1fr',
    gridTemplateRows: '60px 200px 1fr',
    gridTemplateAreas: '"search" "map" "store-list"',
    rowGap: '8px',
  },
});

export const storeSearch = css({
  gridArea: 'search',
});

export const storeList = css({
  gridArea: 'store-list',
  overflowY: 'scroll',
  WebkitOverflowScrolling: 'touch',
  width: 300,
  [responsiveMediaQuery('<=sm', { appAlways: true })]: {
    width: '100%',
  },
});

export const storeDetailsMap = css({
  gridArea: 'map',
});

export const storeDetails = css({
  gridArea: 'store-details',
  [responsiveMediaQuery('<=sm', { appAlways: true })]: {
    display: 'none',
  },
});
