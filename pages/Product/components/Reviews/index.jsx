/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { features } from 'Config/app.json';
import connect from './connector';
import List from './components/List';
import Header from './components/Header';
import AllReviewsLink from './components/AllReviewsLink';

/**
 * Reviews Component
 * @param {string} productId ProductId.
 * @param {Object} rating Rating of the product.
 * @param {Array} reviews Reviews which should be shown in the product page.
 * @returns {JSX|null}
 */
const Reviews = ({ productId, rating, reviews }) => {
  if (!features.showReviews || !rating || !rating.count) {
    return null;
  }

  const count = reviews.totalReviewCount ? reviews.totalReviewCount : 0;

  return (
    <div>
      <Header rating={rating} />
      <List reviews={reviews} />
      <AllReviewsLink totalReviewCount={count} productId={productId} />
    </div>
  );
};

Reviews.propTypes = {
  productId: PropTypes.string.isRequired,
  rating: PropTypes.shape(),
  reviews: PropTypes.arrayOf(PropTypes.shape()),
};

Reviews.defaultProps = {
  rating: null,
  reviews: null,
};

export default connect(Reviews);
