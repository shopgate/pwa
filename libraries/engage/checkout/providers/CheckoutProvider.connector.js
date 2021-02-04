import { connect } from 'react-redux';
import { getShopSettings, getConfigFetching } from '@shopgate/engage/core/config';
import { getPreferredLocationAddress } from '@shopgate/engage/locations/selectors';
import {
  getCheckoutOrder,
  getCheckoutBillingAddress,
  getCheckoutShippingAddress,
  getCheckoutPickupAddress,
  getCheckoutTaxLines,
  getCheckoutPaymentTransactions,
  getIsReserveOnly,
  getIsShippingAddressSelectionEnabled,
  getCheckoutFulfillmentSlot,
} from '@shopgate/engage/checkout/selectors/order';
import { getNeedsPaymentForOrder } from '@shopgate/engage/checkout/selectors/payment';
import { getCampaignAttribution } from '@shopgate/engage/checkout/selectors/campaign';
import { fetchCart } from '@shopgate/pwa-common-commerce/cart';
import {
  prepareCheckout,
  fetchCheckoutOrder,
  updateCheckoutOrder,
  submitCheckoutOrder,
} from '@shopgate/engage/checkout/actions';
import {
  clearCheckoutCampaign,
} from '@shopgate/engage/checkout/action-creators';
import { historyReplace, showModal, makeIsLastStackEntry } from '@shopgate/engage/core';

/**
 * @returns {Function}
 */
function makeMapStateToProps() {
  const isLastStackEntry = makeIsLastStackEntry();

  /**
   * @param {Object} state The application state.
   * @param {Object} props The component props
   * @returns {Object}
   */
  return (state, props) => ({
    isDataReady: !getConfigFetching(state) && !!getCheckoutOrder(state),
    needsPayment: getNeedsPaymentForOrder(state) || false,
    paymentTransactions: getCheckoutPaymentTransactions(state),
    fulfillmentSlot: getCheckoutFulfillmentSlot(state),
    shopSettings: getShopSettings(state),
    userLocation: getPreferredLocationAddress(state),
    billingAddress: getCheckoutBillingAddress(state),
    shippingAddress: getCheckoutShippingAddress(state),
    pickupAddress: getCheckoutPickupAddress(state),
    taxLines: getCheckoutTaxLines(state),
    orderReserveOnly: getIsReserveOnly(state),
    isShippingAddressSelectionEnabled: getIsShippingAddressSelectionEnabled(state),
    campaignAttribution: getCampaignAttribution(state),
    order: getCheckoutOrder(state),
    isLastStackEntry: isLastStackEntry(state, props),
  });
}

const mapDispatchToProps = {
  historyReplace,
  fetchCart,
  prepareCheckout,
  fetchCheckoutOrder,
  updateCheckoutOrder,
  submitCheckoutOrder,
  clearCheckoutCampaign,
  showModal,
};

export default connect(makeMapStateToProps, mapDispatchToProps);
