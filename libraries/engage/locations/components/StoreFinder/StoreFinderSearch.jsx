import React from 'react';
import StoreListSearch from '../StoreList/StoreListSearch';
import { container } from './StoreFinderSearch.style';

/**
 * @returns {JSX}
 */
const StoreFinderSearch = () => (
  <div className={container}>
    <StoreListSearch isStoreFinder />
  </div>
);

export default StoreFinderSearch;
