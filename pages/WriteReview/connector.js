/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { connect } from 'react-redux';
import { getUserReviewsById } from '@shopgate/pwa-common-commerce/reviews/selectors';
import { getCurrentBaseProductId } from '@shopgate/pwa-common-commerce/product/selectors/product';
import getUserReview from '@shopgate/pwa-common-commerce/reviews/actions/getUserReview';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  productId: getCurrentBaseProductId(state),
  review: getUserReviewsById(state),
});

const mapStateToDispatch = (dispatch) => ({
  getUserReview: (productId = null) => dispatch(getUserReview(productId)),
});

export default connect(mapStateToProps, mapStateToDispatch, null, { withRef: true });
