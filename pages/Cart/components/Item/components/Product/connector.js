import { connect } from 'react-redux';
import { isIos } from '@shopgate/pwa-common/selectors/client';
import deleteProductsFromCart from '@shopgate/pwa-common-commerce/cart/actions/deleteProductsFromCart';
import updateProductsInCart from '@shopgate/pwa-common-commerce/cart/actions/updateProductsInCart';
import { getCurrency } from '@shopgate/pwa-common-commerce/cart/selectors';

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
