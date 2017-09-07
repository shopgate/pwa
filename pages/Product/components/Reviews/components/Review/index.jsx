/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';

/**
 * Single Review Component
 * @param {Object} props The props
 * @returns {XML}
 * @constructor
 */
const Review = props => (
  <div>
    <p>{props.rating}</p>
    <p>{props.title}</p>
    <p>{props.text}</p>
    <p>{props.author}</p>
  </div>
);

Review.propTypes = {
  author: PropTypes.string,
  rating: PropTypes.number,
  text: PropTypes.string,
  title: PropTypes.string,
};

Review.defaultProps = {
  title: null,
  author: null,
  text: null,
  rating: null,
};

export default Review;
