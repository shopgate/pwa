/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import RatingStars from 'Components/RatingStars';
import styles from './style';

/**
 * Review Rating Component.
 * @param {number} rate The rating value.
 * @returns {JSX}
 */
const Rating = ({ rate }) => (
  <div className={styles.container}>
    <RatingStars value={rate} className={styles.stars} />
  </div>
);

Rating.propTypes = {
  rate: PropTypes.number,
};

Rating.defaultProps = {
  rate: 0,
};

export default Rating;
