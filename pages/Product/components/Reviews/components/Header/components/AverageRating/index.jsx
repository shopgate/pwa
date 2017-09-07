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
import style from './style';

/**
 * The average rating and number of ratings for a product
 * @param {Object} rating The rating values
 * @returns {XML}
 * @constructor
 */
const AverageRating = ({ rating }) => {
  let average = 0;
  let count = 0;

  if (rating && rating.count) {
    average = rating.average;
    count = rating.count;
  }

  return (
    <div className={style.center}>
      <RatingStars value={average} display="large" />
      <RatingCount count={count} />
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
