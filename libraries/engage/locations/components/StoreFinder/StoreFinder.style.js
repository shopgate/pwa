import { css } from 'glamor';
import { responsiveMediaQuery } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

export const container = css({
  display: 'grid',
  gridTemplateColumns: '350px 1fr',
  gridTemplateRows: 'auto 300px 1fr 1fr',
  gridTemplateAreas: `
    "search map"
    "store-list map"
    "store-list store-details"
    "store-list store-details"
  `,
  height: 'calc(100vh - var(--app-bar-height))',
  [responsiveMediaQuery('<=sm', { appAlways: true })]: {
    gridTemplateColumns: '1fr',
    gridTemplateRows: 'auto 200px 1fr',
    gridTemplateAreas: '"search" "map" "store-list"',
  },
});

export const storeSearch = css({
  gridArea: 'search',
  padding: `${variables.gap.big}px 4px 4px 4px`,
  ' select': {
    color: 'var(--color-text-medium-emphasis)',
  },
});

export const storeList = css({
  gridArea: 'store-list',
  width: 350,
  overflow: 'hidden',
  [responsiveMediaQuery('<=sm', { appAlways: true })]: {
    width: '100%',
  },
});

export const storeDetailsMap = css({
  gridArea: 'map',
  paddingBottom: variables.gap.big,
  [responsiveMediaQuery('>sm', { appAlways: true })]: {
    paddingRight: variables.gap.big,
    paddingTop: variables.gap.big,
    paddingBottom: 0,
  },
});

export const storeDetails = css({
  gridArea: 'store-details',
  paddingRight: variables.gap.big,
  paddingTop: variables.gap.big,
  [responsiveMediaQuery('<=sm', { appAlways: true })]: {
    display: 'none',
  },
});
