/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import style from './style';
import ReviewDate from './components/ReviewDate';
import ReviewAuthor from './components/ReviewAuthor';

/**
 * Single Review Component
 * @param {Object} props The props
 * @returns {XML}
 * @constructor
 */
const ReviewInfo = ({ review }) => (
  <div className={style.info}>
    <ReviewDate date={review.date} /> <ReviewAuthor author={review.author} />
  </div>
);

ReviewInfo.propTypes = {
  review: PropTypes.shape(),
};

ReviewInfo.defaultProps = {
  review: null,
};

export default ReviewInfo;
