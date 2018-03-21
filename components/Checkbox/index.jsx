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
