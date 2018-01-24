/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { connect } from 'react-redux';
import { getProductsResult } from '@shopgate/pwa-common-commerce/product/selectors/product';
import getProducts from './actions/getProducts';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  viewMode: state.ui.categoryPage.viewMode,
  ...getProductsResult(state),
});

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  getProducts(offset) {
    dispatch(getProducts(offset));
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
