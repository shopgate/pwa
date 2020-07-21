import React, { useRef } from 'react';
import { hot } from 'react-hot-loader/root';
import { StoreFinderProvider, FulfillmentProvider } from '../../providers';

import StoreListSearch from '../StoreList/StoreListSearch';
import StoreFinderMap from './StoreFinderMap';
import StoreFinderLocations from './StoreFinderLocations';
import StoreFinderLocationDetailsWide from './StoreFinderLocationDetailsWide';
import {
  container,
  storeSearch,
  storeList,
  storeDetails,
  storeDetailsMap,
} from './StoreFinder.style';

/**
 * @returns {JSX}
 */
const StoreFinder = () => {
  const storeListRef = useRef(null);

  return (
    <FulfillmentProvider noProduct noInventory noLocationSelection isStoreFinder>
      <StoreFinderProvider storeListRef={storeListRef}>
        <div className={container}>
          <div className={storeSearch}>
            <StoreListSearch />
          </div>
          <div className={storeDetailsMap}>
            <StoreFinderMap />
          </div>
          <div className={storeDetails}>
            <StoreFinderLocationDetailsWide />
          </div>
          <div className={storeList}>
            <StoreFinderLocations ref={storeListRef} />
          </div>
        </div>
      </StoreFinderProvider>
    </FulfillmentProvider>
  );
};

export default hot(StoreFinder);
