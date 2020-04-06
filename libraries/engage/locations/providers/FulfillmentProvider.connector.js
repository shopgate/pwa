// @flow
import { connect } from 'react-redux';
import { getBaseProduct, getProduct } from '@shopgate/pwa-common-commerce/product/selectors/product';
import addProductsToCart from '@shopgate/pwa-common-commerce/cart/actions/addProductsToCart';
import updateProductsInCart from '@shopgate/pwa-common-commerce/cart/actions/updateProductsInCart';
import { makeGetFulfillmentPaths, getShopSettings } from '@shopgate/engage/core/config';
import { selectLocation, storeFormInput } from '../action-creators';
import {
  makeGetProductLocation, makeGetProductLocations, makeGetUserFormInput, makeGetFulfillmentMethods,
} from '../selectors';
import { submitReservation } from '../actions';
import { type OwnProps, type StateProps, type DispatchProps } from './FulfillmentProvider.types';

/**
 * @returns {Function}
 */
function makeMapStateToProps() {
  const getProductLocations = makeGetProductLocations();
  const getUserFormInput = makeGetUserFormInput();
  const getFulfillmentPaths = makeGetFulfillmentPaths();
  const getProductLocation = makeGetProductLocation(true);
  const getFulfillmentMethods = makeGetFulfillmentMethods();

  /**
   * @param {Object} state The application state.
   * @param {Object} props The component props.
   * @returns {Object}
   */
  return (state, props) => ({
    locations: getProductLocations(state, props),
    baseProduct: getBaseProduct(state, props),
    product: getProduct(state, props),
    location: getProductLocation(state, props),
    userInput: getUserFormInput(state),
    fulfillmentPaths: getFulfillmentPaths(state),
    fulfillmentMethods: getFulfillmentMethods(state, props),
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
