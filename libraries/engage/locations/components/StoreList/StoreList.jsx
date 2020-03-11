// @flow
import { hot } from 'react-hot-loader/root';
import * as React from 'react';
import StoreListProduct from './StoreListProduct';
import StoreListSearch from './StoreListSearch';
import StoreListLocations from './StoreListLocations';

/**
 * Renders the store list.
 * @returns {JSX}
 */
const StoreList = () => (
  <React.Fragment>
    <StoreListProduct />
    <StoreListSearch />
    <StoreListLocations />
  </React.Fragment>
);

export default hot(StoreList);
