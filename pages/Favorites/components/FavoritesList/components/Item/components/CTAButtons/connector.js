/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { connect } from 'react-redux';
import addToCart from '@shopgate/pwa-common-commerce/cart/actions/addProductsToCart';
import { getIsBaseProduct } from '@shopgate/pwa-common-commerce/product/selectors/product';
import showVariantModal from '@shopgate/pwa-common-commerce/favorites/actions/showVariantModal';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  isBaseProduct: productId => getIsBaseProduct(state, productId),
});

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  addToCart: productData => dispatch(addToCart(productData)),
  showVariantModal: productId => dispatch(showVariantModal(productId)),
});

export default connect(mapStateToProps, mapDispatchToProps);
