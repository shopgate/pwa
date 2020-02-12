import { connect } from 'react-redux';
import { getProduct } from '@shopgate/engage/product';
import { addProductsToCart } from '@shopgate/engage/cart';
import { makeGetMerchantSettings } from '@shopgate/engage/core';
import { selectLocation, storeFormInput } from '../../action-creators';
import { makeGetProductLocations, makeGetUserFormInput } from '../../selectors';
import { submitReservation } from '../../actions';

/**
 * @returns {Function}
 */
function makeMapStateToProps() {
  const getProductLocations = makeGetProductLocations();
  const getUserFormInput = makeGetUserFormInput();
  const getMerchantSettings = makeGetMerchantSettings();

  /**
   * @param {Object} state The application state.
   * @param {Object} props The component props.
   * @returns {Object}
   */
  return (state, props) => ({
    locations: getProductLocations(state, props),
    product: getProduct(state, props),
    userInput: getUserFormInput(state),
    settings: getMerchantSettings(state),
  });
}

/**
 * @param {Function} dispatch The dispatch function.
 * @returns {Object}
 */
const mapDispatchToProps = {
  selectLocation,
  submitReservation,
  storeFormInput,
  addProductsToCart,
};

export default connect(makeMapStateToProps, mapDispatchToProps);
