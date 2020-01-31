import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormContext } from '@shopgate/pwa-common/context';
import BaseCheckbox from '@shopgate/pwa-common/components/Checkbox';
import CheckedIcon from '../icons/CheckedIcon';
import UncheckedIcon from '../icons/UncheckedIcon';
import styles from './style';

/**
 * The checkbox template component.
 * @param {string} checkedClassName class for checked icon.
 * @param {string} unCheckedClassName class for unchecked icon.
 * @param {Object} props The component properties.
 * @returns {JSX}
 */
const Checkbox = ({ checkedClassName, unCheckedClassName, ...props }) => {
  const { checkbox: { icon: { checked = {}, unchecked = {} } = {} } = {} }
    = useContext(FormContext) || {};

  return (
    <BaseCheckbox
      {...props}
      checkedIcon={
        <CheckedIcon className={classNames(styles.icon, checkedClassName, checked.className)} />
      }
      uncheckedIcon={
        <UncheckedIcon
          className={classNames(styles.icon, unCheckedClassName, unchecked.className)}
        />
      }
    />
  );
};

Checkbox.propTypes = {
  checkedClassName: PropTypes.string,
  unCheckedClassName: PropTypes.string,
};

Checkbox.defaultProps = {
  checkedClassName: styles.checkedIcon,
  unCheckedClassName: styles.uncheckedIcon,
};

export default Checkbox;
