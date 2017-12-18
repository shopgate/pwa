/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { RATING_SCALE_DIVISOR } from 'Components/RatingStars/constants';
import I18n from '@shopgate/pwa-common/components/I18n';
import AverageRating from './components/AverageRating';
import WriteReviewLink from './components/WriteReviewLink';
import styles from './style';

/**
 * The header of the reviews component
 * @param {Object} rating The rating values
 * @returns {JSX}
 */
const Header = ({ rating }) => {
  if (!rating) {
    return null;
  }
  const { average = 0 } = rating;

  if (!average) {
    return (
      <div className={styles.container}>
        <AverageRating rating={rating} />
        <div className={styles.noReviews}>
          <I18n.Text string="reviews.no_reviews" />
          <WriteReviewLink />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container} id="reviewsExcerpt">
      <AverageRating rating={rating} />
      <div className={styles.reviewsLine}>
        <I18n.Text string="reviews.rating" className={styles.averageRatingText}>
          <span className={styles.averageRatingNumber}>
            {average / RATING_SCALE_DIVISOR}
          </span>
        </I18n.Text>
        <WriteReviewLink />
      </div>
    </div>
  );
};

Header.propTypes = {
  rating: PropTypes.shape(),
};

Header.defaultProps = {
  rating: null,
};

export default Header;
