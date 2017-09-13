/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import AverageRating from './components/AverageRating';
import styles from './style';

const RATING_AVERAGE_MULTIPLIER = 5;

/**
 * The header of the reviews component
 * @param {Object} rating The rating values
 * @returns {JSX}
 */
const Header = ({ rating }) => {
  const { average } = rating;

  if (!average) {
    return (
      <div className={styles.container}>
        <AverageRating rating={rating} />
        <div className={styles.noReviews}>
          <I18n.Text string="reviews.no_reviews" />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <AverageRating rating={rating} />
      <div className={styles.reviewsLine}>
        <I18n.Text string="reviews.rating">
          <span className={styles.averageRating}>{average * RATING_AVERAGE_MULTIPLIER}</span>
        </I18n.Text>
      </div>
    </div>
  );
};

Header.propTypes = {
  rating: PropTypes.shape(),
};

Header.defaultProps = {
  rating: {
    average: 0,
  },
};

export default Header;
