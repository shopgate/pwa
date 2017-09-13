/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import RatingStars from 'Components/RatingStars';
import styles from './style';

/**
 * Review Rating Component
 * @param {number} rate The rating value
 * @returns {JSX}
 */
const Rating = ({ rate }) => {
  let stars = 1;
  if (rate > 20) {
    stars = rate / 20;
  }

  return (
    <div>
      <RatingStars
        value={rate / 100}
        className={styles.stars}
      />
      <I18n.Text
        string="reviews.rating_stars"
        params={[stars]}
        className={styles.text}
      />
    </div>
  );
};

Rating.propTypes = {
  rate: PropTypes.number,
};

Rating.defaultProps = {
  rate: null,
};

export default Rating;
