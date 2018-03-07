/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import appConfig from '@shopgate/pwa-common/helpers/config';
import styles from './style';

/**
 * The navigator logo component.
 * @return {JSX}
 */
const Logo = () => <img className={styles} src={appConfig.logo} alt="Logo" />;

export default Logo;
