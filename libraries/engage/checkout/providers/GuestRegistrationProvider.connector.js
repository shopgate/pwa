import { connect } from 'react-redux';
import { getShopSettings, getConfigFetching } from '@shopgate/engage/core/config';
import { getPreferredLocationAddress } from '@shopgate/engage/locations/selectors';
import {
  getCheckoutOrder,
  getCheckoutBillingAddress,
  getCheckoutPickupAddress,
  getIsReserveOnly,
  isPickupAndBillingEquals,
} from '@shopgate/engage/checkout/selectors/order';
import { getNeedsPaymentForOrder } from '@shopgate/engage/checkout/selectors/payment';
import { getMerchantCustomerAttributes } from '@shopgate/engage/core/selectors/merchantSettings';
import { getRequiredGuestCheckoutFields } from '@shopgate/engage/checkout/selectors/guestCheckout';
import {
  prepareCheckout,
  fetchCheckoutOrder,
  updateCheckoutOrder,
} from '@shopgate/engage/checkout';
import { historyPush, historyPop } from '@shopgate/engage/core';

/**
 * @returns {Function}
 */
function makeMapStateToProps() {
  /**
   * @param {Object} state The application state.
   * @returns {Object}
   */
  return state => ({
    isDataReady: !getConfigFetching(state) && !!getCheckoutOrder(state),
    needsPayment: getNeedsPaymentForOrder(state) || false,
    shopSettings: getShopSettings(state),
    userLocation: getPreferredLocationAddress(state),
    billingAddress: getCheckoutBillingAddress(state),
    pickupAddress: getCheckoutPickupAddress(state),
    billingPickupEquals: isPickupAndBillingEquals(state),
    requiredFields: getRequiredGuestCheckoutFields(state),
    orderReserveOnly: getIsReserveOnly(state),
    customerAttributes: getMerchantCustomerAttributes(state),
  });
}

const mapDispatchToProps = {
  historyPush,
  historyPop,
  fetchCheckoutOrder,
  prepareCheckout,
  updateCheckoutOrder,
};

export default connect(makeMapStateToProps, mapDispatchToProps);
