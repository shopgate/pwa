/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import styles from './style';

/**
 * Review Title Component.
 * @param {string} title The title of the review.
 * @returns {JSX}
 */
const Title = ({ title }) => (
  <div className={styles}>{title}</div>
);

Title.propTypes = {
  title: PropTypes.string,
};

Title.defaultProps = {
  title: null,
};

export default Title;
