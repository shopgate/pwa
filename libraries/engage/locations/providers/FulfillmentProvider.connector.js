// @flow
import { connect } from 'react-redux';
import { getBaseProduct, getProduct } from '@shopgate/pwa-common-commerce/product/selectors/product';
import addProductsToCart from '@shopgate/pwa-common-commerce/cart/actions/addProductsToCart';
import updateProductsInCart from '@shopgate/pwa-common-commerce/cart/actions/updateProductsInCart';
import { makeGetFulfillmentPaths, makeGetEnabledFulfillmentMethods, getShopSettings } from '@shopgate/engage/core/config';
import { selectLocation, storeFormInput } from '../action-creators';
import {
  makeGetLocationInventory,
  makeGetLocationsForProduct,
  getPreferredLocation,
  getUserFormInput,
  getProductFulfillmentMethods,
} from '../selectors';
import { submitReservation } from '../actions';
import { type OwnProps, type StateProps, type DispatchProps } from './FulfillmentProvider.types';

/**
 * @returns {Function}
 */
function makeMapStateToProps() {
  /* eslint-disable require-jsdoc */
  const getProductCode = (_, props) => props.variantId || props.productId || null;
  /* eslint-enable require-jsdoc */

  const getInventory = makeGetLocationInventory(
    (state, props) => getPreferredLocation(state, props)?.code || null,
    getProductCode
  );
  const getProductLocations = makeGetLocationsForProduct(
    getProductCode
  );

  const getFulfillmentPaths = makeGetFulfillmentPaths();
  const getEnabledFulfillmentMethods = makeGetEnabledFulfillmentMethods();

  /**
   * @param {Object} state The application state.
   * @param {Object} props The component props.
   * @returns {Object}
   */
  return (state, props) => ({
    locations: getProductLocations(state, props),
    baseProduct: getBaseProduct(state, props),
    product: getProduct(state, props),
    location: getPreferredLocation(state, props),
    inventory: getInventory(state, props),
    userInput: getUserFormInput(state),
    fulfillmentPaths: getFulfillmentPaths(state),
    fulfillmentMethods: getProductFulfillmentMethods(state, props),
    enabledFulfillmentMethods: getEnabledFulfillmentMethods(state, props),
    shopSettings: getShopSettings(state),
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
  updateProductsInCart,
};

export default connect<StateProps, DispatchProps, OwnProps>(
  makeMapStateToProps,
  mapDispatchToProps
);
