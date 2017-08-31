/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import RatingStars from 'Components/RatingStars';

/**
 * The Rating component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Rating = ({ rating }) => {
  if (!rating || !rating.count) {
    return null;
  }

  return (
    <RatingStars value={rating.average} />
  );
};

Rating.propTypes = {
  rating: PropTypes.shape(),
};

Rating.defaultProps = {
  rating: null,
};

export default Rating;
