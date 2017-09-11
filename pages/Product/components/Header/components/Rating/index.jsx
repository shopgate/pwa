/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { features } from 'Config/app.json';
import RatingStars from 'Components/RatingStars';
import connect from './connector';

/**
 * The Rating component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Rating = ({ rating }) => {
  if (!features.showReviews || !rating || !rating.count > 0) {
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

export default connect(Rating);
