import * as React from 'react';
import StoreListProduct from './StoreListProduct';
import StoreListSearch from './StoreListSearch';
import StoreListLocations from './StoreListLocations';

/**
 * Renders the store list.
 * @returns {JSX}
 */
const StoreList = () => (
  <>
    <StoreListProduct />
    <StoreListSearch />
    <StoreListLocations />
  </>
);

export default StoreList;
