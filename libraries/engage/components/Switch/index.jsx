import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './style';

/**
 * The Switch component.
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
const Switch = ({
  disabled, checked, onChange, id,
}) => {
  const switchId = useMemo(() => id || Math.random(), [id]);

  return (
    <div className={styles.container}>
      <input
        onChange={onChange}
        className={styles.input}
        disabled={disabled}
        checked={checked}
        type="checkbox"
        id={switchId}
      />
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label
        className={disabled
          ? classNames(styles.disabled, styles.switchButton)
          : styles.switchButton}
        htmlFor={switchId}
      />
    </div>
  );
};

Switch.propTypes = {
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  onChange: PropTypes.func,
};
Switch.defaultProps = {
  disabled: false,
  checked: false,
  onChange: null,
  id: null,
};

export default Switch;
