/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import style from './style';

/**
 * Review Title Component
 * @param {string} title The title of a review
 * @returns {XML}
 * @constructor
 */
const ReviewTitle = ({ title }) => (
  <div className={style.title}>{title}</div>
);

ReviewTitle.propTypes = {
  title: PropTypes.string,
};

ReviewTitle.defaultProps = {
  title: null,
};

export default ReviewTitle;