import { connect } from 'react-redux';
import { getShopSettings, getConfigFetching } from '@shopgate/engage/core/config';
import { makeGetUserLocationAddress } from '@shopgate/engage/locations/selectors';
import {
  getCheckoutBillingAddress,
  getCheckoutTaxLines,
} from '@shopgate/engage/checkout/selectors/order';
import {
  initializeCheckout,
  fetchCheckoutOrder,
  fetchPaymentMethods,
  updateCheckoutOrder,
} from '@shopgate/engage/checkout';

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
    isDataReady: !getConfigFetching(state),
    shopSettings: getShopSettings(state),
    userLocation: getUserLocationAddress(state),
    billingAddress: getCheckoutBillingAddress(state),
    taxLines: getCheckoutTaxLines(state),
  });
}

const mapDispatchToProps = {
  initializeCheckout,
  fetchCheckoutOrder,
  updateCheckoutOrder,
  fetchPaymentMethods,
};

export default connect(makeMapStateToProps, mapDispatchToProps);
