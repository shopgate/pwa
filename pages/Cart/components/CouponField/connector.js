/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import connect from '@shopgate/pwa-common/components/Router/helpers/connect';
import addCouponsToCart from '@shopgate/pwa-common-commerce/cart/actions/addCouponsToCart';
import { isCurrentViewLoading } from '@shopgate/pwa-common/selectors/view';

/**
 * Connects the component with the state.
 * @param {Object} state The application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  isLoading: isCurrentViewLoading(state),
});

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  addCoupon: couponId => dispatch(addCouponsToCart([couponId])),
});

export default connect(mapStateToProps, mapDispatchToProps);
