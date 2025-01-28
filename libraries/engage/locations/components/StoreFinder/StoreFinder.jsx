import React, { useRef } from 'react';
import { hot } from 'react-hot-loader/root';
import { StoreFinderProvider } from '../../providers';
import StoreFinderSearch from './StoreFinderSearch';
import StoreFinderLocations from './StoreFinderLocations';
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
        </div>
        <div className={storeList}>
          <StoreFinderLocations ref={storeListRef} />
        </div>
      </div>
    </StoreFinderProvider>
  );
};

export default hot(StoreFinder);
