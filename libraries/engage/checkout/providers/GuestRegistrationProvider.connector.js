import { connect } from 'react-redux';
import { getShopSettings, getConfigFetching } from '@shopgate/engage/core/config';
import { makeGetUserLocationAddress } from '@shopgate/engage/locations/selectors';
import {
  getCheckoutOrder,
  getCheckoutBillingAddress,
  getCheckoutPickupAddress,
  isPickupAndBillingEquals,
} from '@shopgate/engage/checkout/selectors/order';
import {
  initializeCheckout,
  fetchCheckoutOrder,
  updateCheckoutOrder,
} from '@shopgate/engage/checkout';
import { historyPush } from '@shopgate/engage/core';

/**
 * @returns {Function}
 */
function makeMapStateToProps() {
  const getUserLocationAddress = makeGetUserLocationAddress();

  /**
   * @param {Object} state The application state.
   * @returns {Object}
   */
  return state => ({
    isDataReady: !getConfigFetching(state) && !!getCheckoutOrder(state),
    shopSettings: getShopSettings(state),
    userLocation: getUserLocationAddress(state),
    billingAddress: getCheckoutBillingAddress(state),
    pickupAddress: getCheckoutPickupAddress(state),
    billingPickupEquals: isPickupAndBillingEquals(state),
  });
}

const mapDispatchToProps = {
  historyPush,
  fetchCheckoutOrder,
  initializeCheckout,
  updateCheckoutOrder,
};

export default connect(makeMapStateToProps, mapDispatchToProps);
