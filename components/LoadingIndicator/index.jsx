/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import IndicatorCircle from 'Components/IndicatorCircle';
import styles from './style';

/**
 * Renders a loading indicator.
 * @returns {JSX}
 */
const LoadingIndicator = () => (
  <div className={styles}>
    <IndicatorCircle />
  </div>
);

export default LoadingIndicator;
