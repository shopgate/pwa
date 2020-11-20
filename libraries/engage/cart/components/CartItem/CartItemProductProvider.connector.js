// @flow
import { connect } from 'react-redux';
import { isAndroid } from '@shopgate/pwa-common/selectors/client';
import deleteProductsFromCart from '@shopgate/pwa-common-commerce/cart/actions/deleteProductsFromCart';
import updateProductsInCart from '@shopgate/pwa-common-commerce/cart/actions/updateProductsInCart';
import { getCurrency } from '@shopgate/pwa-common-commerce/cart/selectors';
import {
  type OwnProps,
  type StateProps,
  type DispatchProps,
} from './CartItemProductProvider.types';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  isAndroid: isAndroid(state),
  currency: getCurrency(state),
});

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  deleteProduct: cartItemId => dispatch(deleteProductsFromCart([cartItemId])),
  updateProduct: (cartItemId, quantity) => {
    if (quantity === 0) {
      return dispatch(deleteProductsFromCart([cartItemId]));
    }

    return dispatch(updateProductsInCart([{
      cartItemId,
      quantity,
    }]));
  },
});

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps);
