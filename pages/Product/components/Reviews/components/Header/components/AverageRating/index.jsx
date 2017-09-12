/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import RatingStars from '../../../../../../../../components/RatingStars';
import RatingCount from '../RatingCount';
import styles from './style';

/**
 * The average rating and number of ratings for a product
 * @param {Object} rating The rating values
 * @returns {JSX}
 */
const AverageRating = ({ rating }) => {
  const { average = 0, count = 0 } = rating;

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
  rating: null,
};

export default AverageRating;
