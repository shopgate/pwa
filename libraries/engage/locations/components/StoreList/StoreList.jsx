import { hot } from 'react-hot-loader/root';
import React, { Fragment } from 'react';
import StoreListProduct from './StoreListProduct';
import StoreListLocations from './StoreListLocations';

/**
 * Renders the store list.
 * @returns {JSX}
 */
function StoreList() {
  return (
    <Fragment>
      <StoreListProduct />
      <StoreListLocations />
    </Fragment>
  );
}

export default hot(StoreList);
