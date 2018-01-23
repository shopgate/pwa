/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import styles from './style';
import Title from './components/Title';
import Rating from './components/Rating';
import Text from './components/Text';
import Info from './components/Info';

/**
 * Single Review Component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Review = ({ review }) => (
  <div className={styles}>
    <Title title={review.title} />
    <Rating rate={review.rate} />
    <Text review={review.review} />
    <Info review={review} />
  </div>
);

Review.propTypes = {
  review: PropTypes.shape().isRequired,
};

export default Review;
