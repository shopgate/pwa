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
import style from './style';

/**
 * Reviews Component
 * @param {Object} props The reviews data
 * @returns {XML}
 * @constructor
 */
const Reviews = ({ rating, reviews }) => {
  const components = [];
  const header = (<Header key="header" rating={rating} />);

  if (!reviews) {
    return header;
  }

  components.push(header);
  Object.keys(reviews).forEach((key) => {
    components.push(
      <Review
        key={key}
        title={reviews[key].title}
        text={reviews[key].review}
        author={reviews[key].author}
        rating={reviews[key].rate}
      />
    );
  });

  return (<div className={style.container}>{components}</div>);
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
