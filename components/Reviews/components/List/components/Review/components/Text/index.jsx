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
 * Review Text Component
 * @param {string} review The review text
 * @returns {JSX|null}
 */
const Text = ({ review }) => {
  if (!review) {
    return null;
  }

  return (
    <div className={styles}>{`"${review}"`}</div>
  );
};

Text.propTypes = {
  review: PropTypes.string,
};

Text.defaultProps = {
  review: null,
};

export default Text;
