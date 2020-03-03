import { connect } from 'react-redux';
import { makeGetFulfillmentPaths } from '@shopgate/engage/core/config';
import { makeGetUserLocation } from '../../selectors';
import { PRODUCT_FULFILLMENT_METHOD_DIRECT_SHIP } from '../../constants';

/**
 * @return {Function}
 */
function makeMapStateToProps() {
  const getFulfillmentPaths = makeGetFulfillmentPaths();
  const getUserLocation = makeGetUserLocation();

  /**
   * @param {Object} state The application state.
   * @returns {Object}
   */
  return (state) => {
    const {
      fulfillmentMethod = PRODUCT_FULFILLMENT_METHOD_DIRECT_SHIP,
    } = getUserLocation(state) || {};

    return {
      fulfillmentPaths: getFulfillmentPaths(state),
      fulfillmentMethod,
    };
  };
}

export default connect(makeMapStateToProps);
