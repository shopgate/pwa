/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import BaseCheckbox from '@shopgate/pwa-common/components/Checkbox';
import CheckedIcon from 'Components/icons/CheckedIcon';
import UncheckedIcon from 'Components/icons/UncheckedIcon';
import styles from './style';

/**
 * The checkbox template component.
 * @param {Object} props The component properties.
 * @returns {JSX}
 */
const Checkbox = props => (
  <BaseCheckbox
    {...props}
    checkedIcon={<CheckedIcon className={styles.checkedIcon} />}
    uncheckedIcon={<UncheckedIcon className={styles.uncheckedIcon} />}
  />
);

export default Checkbox;
