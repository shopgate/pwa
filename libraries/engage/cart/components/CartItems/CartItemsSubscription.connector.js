// @flow
import { connect } from 'react-redux';
import updateProductsInCart from '@shopgate/pwa-common-commerce/cart/actions/updateProductsInCart';

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = {
  updateProductsInCart,
};

export default connect(null, mapDispatchToProps);
