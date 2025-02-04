import React from 'react';
import { css } from 'glamor';
import { themeConfig } from '@shopgate/engage';
import StoreDetails from './components/StoreDetails';
import StoreLocationMap from './components/StoreLocationMap';
import StoresNearby from './components/StoresNearby';
import FindMoreStores from './components/FindMoreStores';
import { StoreDetailsProvider } from '../../providers';

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
  <StoreDetailsProvider>
    <div className={styles.page}>
      <StoreDetails />
      <StoreLocationMap />
      <StoresNearby />
      <FindMoreStores />
    </div>
  </StoreDetailsProvider>

);

export default StoreDetailsContent;
