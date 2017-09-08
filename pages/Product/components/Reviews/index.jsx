/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import connect from './connector';
import Review from './components/Review';
import Header from './components/Header';
import AllReviewsLink from './components/AllReviewsLink';
import style from './style';

/**
 * Reviews Component
 * @param {Object} props The reviews data
 * @returns {XML}
 * @constructor
 */
const Reviews = ({ rating, reviews, totalReviewCount }) => {
  let components = [<Header key="header" rating={rating} />];

  if (!reviews) {
    return (<div className={style.container}>{components}</div>);
  }

  Object.keys(reviews).forEach((key) => {
    components = [
      ...components,
      <Review key={key} review={reviews[key]} />,
    ];
  });

  if (totalReviewCount > 2) {
    components = [
      ...components,
      <AllReviewsLink key="link" count={totalReviewCount} />,
    ];
  }

  return (<div className={style.container}>{components}</div>);
};

Reviews.propTypes = {
  rating: PropTypes.shape(),
  reviews: PropTypes.arrayOf(PropTypes.shape()),
  totalReviewCount: PropTypes.number,
};

Reviews.defaultProps = {
  rating: null,
  reviews: null,
  totalReviewCount: null,
};

export default connect(Reviews);
