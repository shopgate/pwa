import { connect } from 'react-redux';
import { isIos } from '@shopgate/engage/core';
import { deleteProductsFromCart } from '@shopgate/engage/cart';
import { updateProductsInCart } from '@shopgate/engage/cart';
import { getCurrency } from '@shopgate/engage/cart';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  isIos: isIos(state),
  currency: getCurrency(state),
});

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  deleteProduct: cartItemId => dispatch(deleteProductsFromCart([cartItemId])),
  updateProduct: (cartItemId, quantity) => dispatch(updateProductsInCart([{
    cartItemId,
    quantity,
  }])),
});

export default connect(mapStateToProps, mapDispatchToProps);
