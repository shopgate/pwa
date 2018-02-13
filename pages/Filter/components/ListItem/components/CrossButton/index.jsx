/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import CrossIcon from 'Components/icons/CrossIcon';
import styles from './style';
import connect from './connector';

/**
 * The Cross Button component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const CrossButton = ({ removeTemporaryFilter, filterId }) => (
  <button className={styles.cross} onClick={() => removeTemporaryFilter(filterId)}>
    <CrossIcon className={styles.crossIcon} />
  </button>
);

CrossButton.propTypes = {
  filterId: PropTypes.string.isRequired,
  removeTemporaryFilter: PropTypes.func.isRequired,
};

export default connect(CrossButton);
