/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { connect } from 'react-redux';
import { getProductRating } from '@shopgate/pwa-common-commerce/product/selectors/product';
import { getProductReviews } from '@shopgate/pwa-common-commerce/reviews/selectors';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  rating: getProductRating(state),
  reviews: getProductReviews(state),
});

export default connect(mapStateToProps, null, null, { withRef: true });
