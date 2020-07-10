import { connect } from 'react-redux';
import { getShopSettings, getConfigFetching } from '@shopgate/engage/core/config';
import { getPreferredLocationAddress } from '@shopgate/engage/locations/selectors';
import { getCheckoutBillingAddress } from '@shopgate/engage/checkout/selectors/order';
import { getRequiredGuestCheckoutFields } from '@shopgate/engage/checkout/selectors/guestCheckout';
import { updateDefaultBillingContact } from '@shopgate/engage/checkout';
import { historyPop } from '@shopgate/engage/core';

/**
 * @returns {Function}
 */
function makeMapStateToProps() {
  /**
   * @param {Object} state The application state.
   * @param {Object} props Props.
   * @returns {Object}
   */
  return (state, props) => ({
    isDataReady: !getConfigFetching(state),
    shopSettings: getShopSettings(state),
    userLocation: getPreferredLocationAddress(state, props),
    billingAddress: getCheckoutBillingAddress(state),
    requiredFields: getRequiredGuestCheckoutFields(state),
  });
}

const mapDispatchToProps = {
  historyPop,
  updateBilling: updateDefaultBillingContact,
};

export default connect(makeMapStateToProps, mapDispatchToProps);
