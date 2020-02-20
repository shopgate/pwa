import { connect } from 'react-redux';
import { makeGetMerchantSettings } from '@shopgate/engage/core';
import { makeGetUserLocation } from '../../selectors';
import { PRODUCT_FULFILLMENT_METHOD_DIRECT_SHIP } from '../../constants';

/**
 * @return {Function}
 */
function makeMapStateToProps() {
  const getMerchantSettings = makeGetMerchantSettings();
  const getUserLocation = makeGetUserLocation();

  /**
   * @param {Object} state The application state.
   * @returns {Object}
   */
  return (state) => {
    const { enabledFulfillmentMethodSelectionForEngage = [] } = getMerchantSettings(state);
    const {
      fulfillmentMethod = PRODUCT_FULFILLMENT_METHOD_DIRECT_SHIP,
    } = getUserLocation(state) || {};

    return {
      fulfillmentPaths: enabledFulfillmentMethodSelectionForEngage,
      fulfillmentMethod,
    };
  };
}

export default connect(makeMapStateToProps);
