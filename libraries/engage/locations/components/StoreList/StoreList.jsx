import { hot } from 'react-hot-loader/root';
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Product from './Product';
import Locations from './Locations';

/**
 * Renders the store list.
 * @returns {JSX}
 */
function StoreList({ context }) {
  return (
    <Fragment>
      <Product context={context} />
      <Locations context={context} />
    </Fragment>
  );
}

StoreList.propTypes = {
  context: PropTypes.elementType.isRequired,
};

export default hot(StoreList);
