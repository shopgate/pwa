import { connect } from 'react-redux';
import { getShopSettings, getConfigFetching } from '@shopgate/engage/core/config';
import { makeGetUserLocationAddress } from '@shopgate/engage/locations/selectors';
import {
  getCheckoutOrder,
  getCheckoutBillingAddress,
  getCheckoutPickupAddress,
  getCheckoutTaxLines,
  getCheckoutPaymentTransactions,
} from '@shopgate/engage/checkout/selectors/order';
import { fetchCart } from '@shopgate/pwa-common-commerce/cart';
import {
  initializeCheckout,
  fetchCheckoutOrder,
  fetchPaymentMethods,
  updateCheckoutOrder,
  submitCheckoutOrder,
} from '@shopgate/engage/checkout';
import { historyReplace } from '@shopgate/engage/core';

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
    paymentTransactions: getCheckoutPaymentTransactions(state),
    shopSettings: getShopSettings(state),
    userLocation: getUserLocationAddress(state),
    billingAddress: getCheckoutBillingAddress(state),
    pickupAddress: getCheckoutPickupAddress(state),
    taxLines: getCheckoutTaxLines(state),
  });
}

const mapDispatchToProps = {
  historyReplace,
  fetchCart,
  initializeCheckout,
  fetchCheckoutOrder,
  updateCheckoutOrder,
  fetchPaymentMethods,
  submitCheckoutOrder,
};

export default connect(makeMapStateToProps, mapDispatchToProps);
