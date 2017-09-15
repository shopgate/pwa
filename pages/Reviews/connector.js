/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { connect } from 'react-redux';
import { hex2bin } from '@shopgate/pwa-common/helpers/data';
import fetchReviews from '@shopgate/pwa-common-commerce/reviews/actions/fetchReviews';
import { getReviews } from '@shopgate/pwa-common-commerce/reviews/selectors';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  reviews: getReviews(state),
});

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  fetchReviews: (productId, limit, offset) =>
    dispatch(fetchReviews(hex2bin(productId), limit, offset)),
});

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true });
