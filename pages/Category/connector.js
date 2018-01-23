/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { connect } from 'react-redux';
import {
  getCategoryProductCount,
  getCurrentCategory,
  getCurrentCategoryId,
} from '@shopgate/pwa-common-commerce/category/selectors';
import { getProductsResult } from '@shopgate/pwa-common-commerce/product/selectors/product';
import { isFilterBarShown } from './selectors';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => ({
  category: getCurrentCategory(state, props),
  hasProducts: getCategoryProductCount(state, props) > 0,
  isFilterBarShown: isFilterBarShown(state, props),
  isRoot: !getCurrentCategoryId(state, props),
  ...getProductsResult(state, props),
});

export default connect(mapStateToProps, null, null, { withRef: true });
