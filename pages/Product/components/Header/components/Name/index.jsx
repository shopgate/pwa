/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import PlaceholderLabel from 'Components/PlaceholderLabel';
import styles from './style';

/**
 * The Product Name component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Name = ({ name }) => (
  <div className={styles.name}>
    <PlaceholderLabel className={styles.placeholder} ready={(name !== null)}>
      <span>{name}</span>
    </PlaceholderLabel>
  </div>
);

Name.propTypes = {
  name: PropTypes.shape(),
};

Name.defaultProps = {
  name: null,
};

export default Name;
