/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { features } from 'Config/app.json';
import connect from './connector';
import List from './components/List';
import Header from './components/Header';
import styles from './style';

/**
 * Reviews Component
 * @param {Object} props The reviews data
 * @returns {null|JSX}
 */
const Reviews = ({ rating, reviews }) => {
  if (!features.showReviews) {
    return null;
  }

  const header = <Header key="header" rating={rating} />;

  if (!reviews) {
    return (
      <div className={styles.container}>
        {header}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {header}
      <List reviews={reviews} />
    </div>
  );
};

Reviews.propTypes = {
  rating: PropTypes.shape(),
  reviews: PropTypes.arrayOf(PropTypes.shape()),
};

Reviews.defaultProps = {
  rating: null,
  reviews: null,
};

export default connect(Reviews);
