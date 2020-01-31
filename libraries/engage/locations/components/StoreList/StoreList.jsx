import { hot } from 'react-hot-loader/root';
import React, { Fragment } from 'react';
import Product from './Product';
import Locations from './Locations';

/**
 * Renders the store list.
 * @returns {JSX}
 */
function StoreList() {
  return (
    <Fragment>
      <Product />
      <Locations />
    </Fragment>
  );
}

export default hot(StoreList);
