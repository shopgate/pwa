import React from 'react';
import { hot } from 'react-hot-loader/root';
import { FulfillmentProvider } from '../../providers';
import { StoreListLocations, StoreListSearch } from '../StoreList';
import StoreLocationFinderMap from './StoreLocationFinderMap';
import {
  container,
  storeSearch,
  storeList,
  storeDetails,
  storeDetailsMap,
} from './StoreLocationFinder.style';

/**
 * @returns {JSX}
 */
const StoreLocationFinder = () => (
  <FulfillmentProvider noProduct noInventory noLocationSelection isStoreFinder>
    <div className={container}>
      <div className={storeSearch}>
        <StoreListSearch />
      </div>
      <div className={storeList}>
        <StoreListLocations />
      </div>
      <div className={storeDetailsMap}>
        <StoreLocationFinderMap />
      </div>
      <div className={storeDetails} />
    </div>
  </FulfillmentProvider>
);

export default hot(StoreLocationFinder);
