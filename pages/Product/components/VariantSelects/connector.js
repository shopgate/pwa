/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { connect } from 'react-redux';
import {
  getProductVariants,
  getVariantsByProductId,
} from '@shopgate/pwa-common-commerce/product/selectors/variants';
import { getCurrentBaseProductId } from '@shopgate/pwa-common-commerce/product/selectors/product';
import setProductVariantId from '@shopgate/pwa-common-commerce/product/action-creators/setProductVariantId';
import getProductData from '../../actions/getProductData';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  variants: getProductVariants(state),
  currentBaseProductId: getCurrentBaseProductId(state),
  getVariantsByProductId: productId => getVariantsByProductId(state, null, productId),
});

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  getProductData: (selectedVariantId = null) =>
    dispatch(getProductData(selectedVariantId)),
  setProductVariantId: (variantId = null) =>
    dispatch(setProductVariantId(variantId)),
});

export default connect(mapStateToProps, mapDispatchToProps);
