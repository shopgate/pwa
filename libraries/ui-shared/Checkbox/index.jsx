import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import BaseCheckbox from '@shopgate/pwa-common/components/Checkbox';
import CheckedIcon from '../icons/CheckedIcon';
import UncheckedIcon from '../icons/UncheckedIcon';
import styles from './style';

/**
 * The checkbox template component.
 * @param {string} checkedClassName class for checked icon.
 * @param {string} unCheckedClassName class for unchecked icon.
 * @param {string} className className
 * @param {Object} props The component properties.
 * @returns {JSX}
 */
const Checkbox = ({
  checkedClassName, unCheckedClassName, className, ...props
}) => (
  <BaseCheckbox
    {...props}
    className={`ui-shared__checkbox ${props.className}`}
    checkedIcon={
      <CheckedIcon className={classNames(styles.icon, checkedClassName, 'checkedIcon')} />
    }
    uncheckedIcon={
      <UncheckedIcon className={classNames(styles.icon, unCheckedClassName, 'uncheckedIcon')} />
    }
  />
);

Checkbox.propTypes = {
  checkedClassName: PropTypes.string,
  className: PropTypes.string,
  unCheckedClassName: PropTypes.string,
};

Checkbox.defaultProps = {
  checkedClassName: styles.checkedIcon,
  className: '',
  unCheckedClassName: styles.uncheckedIcon,
};

export default Checkbox;
