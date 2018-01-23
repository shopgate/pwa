/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import PlaceholderLabel from 'Components/PlaceholderLabel';
import AvailableText from 'Components/Availability';
import connect from './connector';
import styles from './style';

/**
 * The Availability component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Availability = ({ availability }) => (
  <PlaceholderLabel className={styles.placeholder} ready={(availability !== null)}>
    {availability && (
      <AvailableText
        className={styles.availability}
        showWhenAvailable
        text={availability.text}
        state={availability.state}
      />
    )}
  </PlaceholderLabel>
);

Availability.propTypes = {
  availability: PropTypes.shape(),
};

Availability.defaultProps = {
  availability: null,
};

export default connect(Availability);
