/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import PlaceholderLabel from 'Components/PlaceholderLabel';
import BaseManufacturer from 'Components/Manufacturer';
import connect from './connector';
import styles from './style';

/**
 * The Manufacturer component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Manufacturer = ({ manufacturer }) => (
  <div className={styles.infoContainer}>
    <PlaceholderLabel className={styles.placeholder} ready={(manufacturer !== null)}>
      <BaseManufacturer text={(manufacturer || '')} />
    </PlaceholderLabel>
  </div>
);

Manufacturer.propTypes = {
  manufacturer: PropTypes.string,
};

Manufacturer.defaultProps = {
  manufacturer: '',
};

export default connect(Manufacturer);
