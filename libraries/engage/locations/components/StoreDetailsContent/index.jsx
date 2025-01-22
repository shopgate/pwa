import React from 'react';
import { css } from 'glamor';
import { themeConfig } from '@shopgate/engage';
import StoreDetails from './components/StoreDetails';
import StoreLocationMap from './components/StoreLocationMap';
import StoresNearby from './components/StoresNearby';
import FindMoreStores from './components/FindMoreStores';

const styles = {
  page: css({
    padding: `${themeConfig.variables.gap.small}px ${themeConfig.variables.gap.big}px`,
  }).toString(),
};

/**
 * @param {Object} props .
 * @returns {JSX}
 */
const StoreDetailsContent = () => (
  <div className={styles.page}>
    <StoreDetails />
    <StoreLocationMap />
    <StoresNearby />
    <FindMoreStores />
  </div>

);

export default StoreDetailsContent;
