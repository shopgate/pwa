import React from 'react';
import BaseCheckbox from '@shopgate/pwa-common/components/Checkbox';
import CheckedIcon from '../icons/RadioCheckedIcon';
import UncheckedIcon from '../icons/RadioUncheckedIcon';
import styles from './style';

/**
 * The radiobox template component.
 * @param {Object} props The component properties.
 * @returns {JSX}
 */
const RadioButton = props => (
  <BaseCheckbox
    {...props}
    checkedIcon={<CheckedIcon className={styles.checkedIcon} />}
    uncheckedIcon={<UncheckedIcon className={styles.uncheckedIcon} />}
  />
);

export default RadioButton;
