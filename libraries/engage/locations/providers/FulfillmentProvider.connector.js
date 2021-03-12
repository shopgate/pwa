// @flow
import { connect } from 'react-redux';
import showModal from '@shopgate/pwa-common/actions/modal/showModal';
import { getBaseProduct, getProduct } from '@shopgate/pwa-common-commerce/product/selectors/product';
import addProductsToCart from '@shopgate/pwa-common-commerce/cart/actions/addProductsToCart';
import updateProductsInCart from '@shopgate/pwa-common-commerce/cart/actions/updateProductsInCart';
import { getCartProducts } from '@shopgate/pwa-common-commerce/cart/selectors';
import { makeGetFulfillmentPaths, makeGetEnabledFulfillmentMethods, getShopSettings } from '@shopgate/engage/core/config';
import { getRestrictMultiLocationOrders } from '@shopgate/engage/core';
import { selectLocation, storeFormInput } from '../action-creators';
import {
  getFilteredLocations,
  makeGetLocationInventory,
  makeGetLocationsForProduct,
  getPreferredLocation,
  getUserFormInput,
  getProductFulfillmentMethods,
  getIsFetching,
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
    locations: props.noProduct
      ? getFilteredLocations(state, props)
      : getProductLocations(state, props),
    baseProduct: getBaseProduct(state, props),
    product: getProduct(state, props),
    location: getPreferredLocation(state, props),
    inventory: getInventory(state, props),
    userInput: getUserFormInput(state),
    fulfillmentPaths: getFulfillmentPaths(state),
    fulfillmentMethods: getProductFulfillmentMethods(state, props),
    enabledFulfillmentMethods: getEnabledFulfillmentMethods(state, props),
    shopSettings: getShopSettings(state),
    isFetching: getIsFetching(state),
    restrictMultiLocationOrders: getRestrictMultiLocationOrders(state),
    cartProducts: getCartProducts(state),
  });
}

/**
 * @param {Function} dispatch The dispatch function.
 * @returns {Object}
 */
const mapDispatchToProps = dispatch => ({
  selectLocation: (...params) => dispatch(selectLocation(...params)),
  submitReservation: (...params) => dispatch(submitReservation(...params)),
  storeFormInput: (...params) => dispatch(storeFormInput(...params)),
  addProductsToCart: (...params) => dispatch(addProductsToCart(...params)),
  updateProductsInCart: (...params) => dispatch(updateProductsInCart(...params)),
  showModal: (...params) => dispatch(showModal(...params)),
});

export default connect<StateProps, DispatchProps, OwnProps>(
  makeMapStateToProps,
  mapDispatchToProps
);
