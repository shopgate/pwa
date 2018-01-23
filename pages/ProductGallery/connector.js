/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import connect from '@shopgate/pwa-common/components/Router/helpers/connect';
import { hex2bin } from '@shopgate/pwa-common/helpers/data';
import disableNavigator from 'Components/Navigator/actions/disableNavigator';
import enableNavigator from 'Components/Navigator/actions/enableNavigator';
import fetchProductImages from '@shopgate/pwa-common-commerce/product/actions/getProductImages';
import {
  getProductImages,
  getCurrentBaseProduct,
} from '@shopgate/pwa-common-commerce/product/selectors/product';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  images: getProductImages(state),
  product: getCurrentBaseProduct(state),
});

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @param {Object} props The current component props.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = (dispatch, props) => ({
  disableNavigator: () => dispatch(disableNavigator()),
  enableNavigator: () => dispatch(enableNavigator()),
  getProductImages: () => {
    const productId = hex2bin(props.params.productId);
    dispatch(fetchProductImages(productId));
  },
});

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true });
