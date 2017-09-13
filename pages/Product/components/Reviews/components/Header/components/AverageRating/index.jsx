/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import RatingStars from 'Components/RatingStars';
import RatingCount from '../RatingCount';
import styles from './style';

/**
 * The average rating and number of ratings for a product
 * @param {Object} rating The rating values
 * @returns {null|JSX}
 */
const AverageRating = ({ rating }) => {
  const { average, count } = rating;

  return (
    <div className={styles.center}>
      <RatingStars value={average} display="large" />
      {count > 0 && <RatingCount count={count} />}
    </div>
  );
};

AverageRating.propTypes = {
  rating: PropTypes.shape(),
};

AverageRating.defaultProps = {
  rating: {
    average: 0,
    count: 0,
  },
};

export default AverageRating;
