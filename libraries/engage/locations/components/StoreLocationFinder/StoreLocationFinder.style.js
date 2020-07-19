import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

export const container = css({
  display: 'grid',
  gridTemplateColumns: '300px 1fr',
  gridTemplateRows: '60px 200px 1fr 1fr',
  gridTemplateAreas: `
    "search map"
    "store-list map"
    "store-list store-details"
    "store-list store-details"
  `,
  columnGap: variables.gap.small,
  rowGap: variables.gap.small,
  height: 'calc(100vh - var(--app-bar-height))',
});

export const storeSearch = css({
  gridArea: 'search',
});

export const storeList = css({
  gridArea: 'store-list',
  overflowY: 'scroll',
  WebkitOverflowScrolling: 'touch',
  width: 300,
});

export const storeDetailsMap = css({
  gridArea: 'map',
});

export const storeDetails = css({
  gridArea: 'store-details',
});

/*
@media all and (max-width: 812px) {
  .container {
    grid-template-columns: 1fr;
    grid-template-rows: 60px 150px 1fr;
    grid-template-areas: "search" "map" "store-list";
    row-gap: 8px;
    height: 100%;
  }

  .store-details {
    display: none;
  }
}
@media only screen
  and (min-device-width: 375px)
  and (max-device-width: 812px)
  and (-webkit-min-device-pixel-ratio: 3) {
    .container {
      grid-template-columns: 1fr;
      grid-template-rows: 60px 150px 1fr;
      grid-template-areas: "search" "map" "store-list";
      row-gap: 8px;
      height: 100%;
    }

    .store-details {
      display: none;
    }
}
*/
