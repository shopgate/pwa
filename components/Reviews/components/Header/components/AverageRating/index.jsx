/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import RatingStars from 'Components/RatingStars';
import RatingCount from 'Components/Reviews/components/RatingCount';
import { container } from './style';

/**
 * The average rating and number of ratings for a product.
 * @param {Object} rating The rating values.
 * @returns {JSX}
 */
const AverageRating = ({ rating }) => {
  const { average = 0, count = 0 } = rating;

  return (
    <div className={container} >
      <RatingStars value={average} display="large" />
      <RatingCount count={count} />
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
