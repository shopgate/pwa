/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import AddReviewLink from './components/AddReviewLink';
import AverageRating from './components/AverageRating';
import style from './style';

/**
 * The header of the reviews component
 * @param {Object} rating The rating values
 * @returns {XML}
 * @constructor
 */
const Header = ({ rating }) => {
  let average = 0;

  if (rating && rating.count) {
    average = rating.average;
  }

  if (!average) {
    return (
      <div className={style.container}>
        <AverageRating rating={rating} />
        <div className={style.noReviews}>
          <I18n.Text string="reviews.no_reviews" />
          <AddReviewLink />
        </div>
      </div>
    );
  }

  return (
    <div className={style.container}>
      <AverageRating rating={rating} />
      <div className={style.reviewsLine}>
        <I18n.Text string="reviews.rating">
          <span className={style.averageRating}>{average * 5}</span>
        </I18n.Text>
        <AddReviewLink />
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
