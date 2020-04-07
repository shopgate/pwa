import { connect } from 'react-redux';
import { getShopSettings, getConfigFetching } from '@shopgate/engage/core/config';
import { makeGetUserLocationAddress } from '@shopgate/engage/locations/selectors';
import {
  initializeCheckout,
  fetchCheckoutOrder,
  fetchPaymentMethods,
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
  });
}

const mapDispatchToProps = {
  initializeCheckout,
  fetchCheckoutOrder,
  fetchPaymentMethods,
};

export default connect(makeMapStateToProps, mapDispatchToProps);
