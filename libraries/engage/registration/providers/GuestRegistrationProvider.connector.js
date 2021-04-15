import { connect } from 'react-redux';
import { getShopSettings, getConfigFetching } from '@shopgate/engage/core/config';
import { hasDirectShipItems } from '@shopgate/engage/cart';
import { getPreferredLocationAddress } from '@shopgate/engage/locations/selectors';
import { getMerchantCustomerAttributes } from '@shopgate/engage/core/selectors/merchantSettings';
import {
  getCheckoutBillingAddress,
  getCheckoutShippingAddress,
  getCheckoutPickupAddress,
  getCheckoutOrderCustomer,
  getIsReserveOnly,
  isPickupAndBillingEquals,
  isShippingBillingEquals,
  getIsShippingAddressSelectionEnabled,
  getIsPickupContactSelectionEnabled,
} from '@shopgate/engage/checkout/selectors/order';
import { getNeedsPaymentForOrder } from '@shopgate/engage/checkout/selectors/payment';
import {
  prepareCheckout,
} from '@shopgate/engage/checkout/actions';
import {
  historyPush,
  historyPop,
  makeIsLastStackEntry,
  getNumberOfAddressLines,
} from '@shopgate/engage/core';
import { submitGuestRegistration } from './GuestRegistrationProvider.actions';

/**
 * @returns {Function}
 */
function makeMapStateToProps() {
  const isLastStackEntry = makeIsLastStackEntry();
  /**
   * @param {Object} state The application state.
   * @param {Object} props The component props.
   * @returns {Object}
   */
  return (state, props) => ({
    isDataReady: !getConfigFetching(state),
    orderNeedsPayment: getNeedsPaymentForOrder(state) || false,
    shopSettings: getShopSettings(state),
    userLocation: getPreferredLocationAddress(state),
    customerAttributes: getMerchantCustomerAttributes(state),
    cartHasDirectShipItems: hasDirectShipItems(state),
    isShippingAddressSelectionEnabled: getIsShippingAddressSelectionEnabled(state),
    isPickupContactSelectionEnabled: getIsPickupContactSelectionEnabled(state),
    orderReserveOnly: getIsReserveOnly(state),
    numberOfAddressLines: getNumberOfAddressLines(state),
    billingAddress: getCheckoutBillingAddress(state),
    shippingAddress: getCheckoutShippingAddress(state),
    pickupAddress: getCheckoutPickupAddress(state),
    billingPickupEquals: isPickupAndBillingEquals(state),
    billingShippingEquals: isShippingBillingEquals(state),
    isLastStackEntry: isLastStackEntry(state, props),
    customer: getCheckoutOrderCustomer(state),
  });
}

const mapDispatchToProps = {
  historyPush,
  historyPop,
  submitGuestRegistration,
  prepareCheckout,
};

export default connect(makeMapStateToProps, mapDispatchToProps);
