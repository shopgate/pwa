/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import connect from '@shopgate/pwa-common/helpers/routedConnect';
import {
  getCurrentCategory,
  getCurrentCategoryId,
} from '@shopgate/pwa-common-commerce/category/selectors';
import { getProductsResult } from '@shopgate/pwa-common-commerce/product/selectors/product';
import { isFilterBarShown } from '../../components/FilterBar/selectors';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => ({
  category: getCurrentCategory(state, props),
  isFilterBarShown: isFilterBarShown(state),
  isRoot: !getCurrentCategoryId(state, props),
  ...getProductsResult(state, props),
});

/**
 * Connects a component to the category store.
 * @param {Object} Component A react component.
 * @return {Object} The react component with extended props.
 */
const category = Component =>
  connect(mapStateToProps, null, null, { withRef: true })(Component)
;

export default category;
