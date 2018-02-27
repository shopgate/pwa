/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { connect } from 'react-redux';
import addToCart from '@shopgate/pwa-common-commerce/cart/actions/addProductsToCart';
import { isBaseProduct } from '@shopgate/pwa-common-commerce/product/selectors/product';
import showModal from '@shopgate/pwa-common/actions/modal/showModal';
import { MODAL_VARIANT_SELECT } from 'Components/Dialog/constants';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  isBaseProduct: productId => isBaseProduct(state, productId),
});

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  addToCart: productData => dispatch(addToCart(productData)),
  showVariantModal: productId => dispatch(showModal({
    title: null,
    type: MODAL_VARIANT_SELECT,
    message: 'favorites.modal.message',
    confirm: 'favorites.modal.confirm',
    dismiss: 'common.cancel',
    params: {
      productId,
    },
  })),
});

export default connect(mapStateToProps, mapDispatchToProps);
