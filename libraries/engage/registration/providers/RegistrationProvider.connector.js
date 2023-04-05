import { connect } from 'react-redux';
import { getShopSettings, getConfigFetching } from '@shopgate/engage/core/config';
import { getNumberOfAddressLines, getRegistrationMode } from '@shopgate/engage/core';
import { hasDirectShipItems } from '@shopgate/engage/cart';
import { getPreferredLocationAddress } from '@shopgate/engage/locations/selectors';
import { getMerchantCustomerAttributes } from '@shopgate/engage/core/selectors/merchantSettings';
import { submitRegistration } from './RegistrationProvider.actions';

/**
 * @returns {Function}
 */
function makeMapStateToProps() {
  /**
   * @param {Object} state The application state.
   * @returns {Object}
   */
  return state => ({
    isDataReady: !getConfigFetching(state),
    shopSettings: getShopSettings(state),
    userLocation: getPreferredLocationAddress(state),
    customerAttributes: getMerchantCustomerAttributes(state),
    cartHasDirectShipItems: hasDirectShipItems(state),
    numberOfAddressLines: getNumberOfAddressLines(state),
    registrationMode: getRegistrationMode(state),
  });
}

const mapDispatchToProps = {
  submitRegistration,
};

export default connect(makeMapStateToProps, mapDispatchToProps);
