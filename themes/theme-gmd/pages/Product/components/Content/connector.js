import { connect } from 'react-redux';
import {
  getBaseProductId,
  getVariantId,
  getProductCurrency,
} from '@shopgate/engage/product';
import { addProductsToCart } from '@shopgate/engage/cart';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => ({
  baseProductId: getBaseProductId(state, props),
  variantId: getVariantId(state, props),
  currency: getProductCurrency(state, props),
});

/**
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  addToCart: products => dispatch(addProductsToCart(products)),
});

export default connect(mapStateToProps, mapDispatchToProps);
