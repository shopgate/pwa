import { connect } from 'react-redux';
import { isAndroid } from '@shopgate/pwa-common/selectors/client';
import deleteProductsFromCart from '@shopgate/pwa-common-commerce/cart/actions/deleteProductsFromCart';
import updateProductsInCart from '@shopgate/pwa-common-commerce/cart/actions/updateProductsInCart';
import { getCurrency } from '@shopgate/pwa-common-commerce/cart/selectors';

/**
 * @typedef {import('./CartItemProductProvider.types').OwnProps} OwnProps
 * @typedef {import('./CartItemProductProvider.types').StateProps} StateProps
 */

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @returns {StateProps} The extended component props.
 */
const mapStateToProps = state => ({
  isAndroid: isAndroid(state),
  currency: getCurrency(state),
});

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @returns {DispatchProps} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  /**
   * Deletes a product from the cart.
   * @param {string} cartItemId The ID of the cart item to delete.
   * @returns {Promise<void>} A promise that resolves when the product is deleted.
   */
  deleteProduct: cartItemId => dispatch(deleteProductsFromCart([cartItemId])),

  /**
   * Updates the quantity of a product in the cart.
   * @param {string} cartItemId The ID of the cart item to update.
   * @param {number} quantity The new quantity.
   * @returns {Promise<void>} A promise that resolves when the product is updated.
   */
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

export default connect(mapStateToProps, mapDispatchToProps);
