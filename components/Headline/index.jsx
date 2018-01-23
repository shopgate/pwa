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
 * The headline component.
 * @param {string} props The component props.
 * @returns {JSX}
 */
const Headline = ({ text }) => (
  text.length ? <h3 className={styles.headline}>{text}</h3> : null
);

Headline.propTypes = {
  text: PropTypes.string.isRequired,
};

export default Headline;
