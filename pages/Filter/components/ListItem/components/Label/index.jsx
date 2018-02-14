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
 * The Filter List Item Label component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Label = ({ label }) => (
  <div className={styles}>
    {label}
  </div>
);

Label.propTypes = {
  label: PropTypes.string.isRequired,
};

export default Label;
