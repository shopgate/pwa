/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { connect } from 'react-redux';
import { getProductName } from '@shopgate/pwa-common-commerce/product/selectors/product';
import resetCurrentProduct from '@shopgate/pwa-common-commerce/product/action-creators/resetCurrentProduct';
import getProductData from './actions/getProductData';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  name: getProductName(state),
});

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  getProductData: (selectedVariantId = null, baseProductId = null) =>
    dispatch(getProductData(selectedVariantId, baseProductId)),
  resetCurrentProduct: () => dispatch(resetCurrentProduct()),
});

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true });
