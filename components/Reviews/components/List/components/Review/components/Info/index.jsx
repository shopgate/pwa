/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import styles from './style';
import ReviewDate from './components/ReviewDate';
import Author from './components/Author';

/**
 * Review Info Component.
 * @param {Object} props The props.
 * @returns {JSX}
 */
const Info = ({ review }) => (
  <div className={styles}>
    <ReviewDate date={review.date} /> <Author author={review.author} />
  </div>
);

Info.propTypes = {
  review: PropTypes.shape(),
};

Info.defaultProps = {
  review: null,
};

export default Info;
