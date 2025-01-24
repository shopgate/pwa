import React, { useRef } from 'react';
import { hot } from 'react-hot-loader/root';
import { ResponsiveContainer } from '@shopgate/engage/components';
import { StoreFinderProvider } from '../../providers';
import StoreFinderSearch from './StoreFinderSearch';
import StoreFinderLocations from './StoreFinderLocations';
import StoreFinderStoresNear from './StoreFinderStoresNear';
import {
  container,
  storeSearch,
  storeList,
} from './StoreFinder.style';

/**
 * @returns {JSX.Element}
 */
const StoreFinder = () => {
  const storeListRef = useRef(null);

  return (
    <StoreFinderProvider storeListRef={storeListRef}>
      <div className={container}>
        <div className={storeSearch}>
          <StoreFinderSearch />
          <ResponsiveContainer breakpoint=">sm" webOnly>
            <StoreFinderStoresNear />
          </ResponsiveContainer>
        </div>
        <div className={storeList}>
          <StoreFinderLocations ref={storeListRef} />
        </div>
      </div>
    </StoreFinderProvider>
  );
};

export default hot(StoreFinder);
