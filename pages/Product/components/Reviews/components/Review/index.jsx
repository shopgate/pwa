/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import style from './style';
import ReviewTitle from './components/ReviewTitle';
import ReviewRating from './components/ReviewRating';
import ReviewText from './components/ReviewText';
import ReviewInfo from './components/ReviewInfo';

/**
 * Single Review Component
 * @param {Object} props The props
 * @returns {XML}
 * @constructor
 */
const Review = ({ review }) => (
  <div className={style.review}>
    <ReviewTitle title={review.title} />
    <ReviewRating rate={review.rate} />
    <ReviewText review={review.review} />
    <ReviewInfo review={review} />
  </div>
);

Review.propTypes = {
  review: PropTypes.shape(),
};

Review.defaultProps = {
  review: null,
};

export default Review;
