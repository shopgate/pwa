import { connect } from 'react-redux';
import {
  getBaseProductId,
  getVariantId,
  getProductCurrency,
} from '@shopgate/pwa-common-commerce/product';
import addProductsToCart from '@shopgate/pwa-common-commerce/cart/actions/addProductsToCart';
import { makeGetProductFulfillmentMethods } from '@shopgate/engage/locations';

/**
 * @return {Function} The connect function.
 */
function makeMapStateToProps() {
  const getFulfillmentMethods = makeGetProductFulfillmentMethods();
  /**
   * @param {Object} state The application state.
 * @param {Object} props The component props.
   * @returns {Object}
 */
  return (state, props) => ({
    baseProductId: getBaseProductId(state, props),
    variantId: getVariantId(state, props),
    currency: getProductCurrency(state, props),
    fulfillmentMethods: getFulfillmentMethods(state, props),
  });
}
/**
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  addToCart: products => dispatch(addProductsToCart(products)),
});

export default connect(makeMapStateToProps, mapDispatchToProps);
