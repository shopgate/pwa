/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { connect } from 'react-redux';
import pushHistory from '@shopgate/pwa-common/actions/history/pushHistory';
import { isViewLoading } from '@shopgate/pwa-common/selectors/view';
import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';
import { getOrderableStatus } from '@shopgate/pwa-common-commerce/cart/selectors';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  isActive: getOrderableStatus(state) && !isViewLoading(state, CART_PATH),
});

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  pushHistory: url => dispatch(pushHistory(url)),
});

export default connect(mapStateToProps, mapDispatchToProps);
