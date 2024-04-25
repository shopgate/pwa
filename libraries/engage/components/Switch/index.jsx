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
  label, title, disabled, checked, onChange,
}) => {
  const switchId = useMemo(() => Math.random(), []);

  return (
    <div className={styles.container}>
      <div className={styles.textWrapper}>
        {title ?
          <span className={styles.title}>{title}</span>
          : null}
        <span>{label}</span>
      </div>
      <div>
        <input
          onChange={onChange}
          className={styles.input}
          disabled={disabled}
          checked={checked}
          type="checkbox"
          id={`${switchId}`}
        />
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label
          className={disabled
            ? classNames(styles.disabled, styles.switchButton)
            : styles.switchButton}
          htmlFor={`${switchId}`}
        />
      </div>
    </div>
  );
};

Switch.propTypes = {
  label: PropTypes.node.isRequired,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  title: PropTypes.node,
};
Switch.defaultProps = {
  disabled: false,
  checked: false,
  title: null,
  onChange: null,
};

export default Switch;
