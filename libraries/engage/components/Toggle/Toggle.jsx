import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './style';

/**
 * The Toggle component.
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
const Toggle = ({
  label, title, disabled, checked, onChange,
}) => {
  const toggleId = useMemo(() => Math.random(), []);

  return (
    <div className={styles.container}>
      <div className={styles.textWrapper}>
        {title ?
          <span className={styles.title}>{title}</span>
          : null}
        <span className={styles.label}>{label}</span>
      </div>
      <div>
        <input
          onChange={onChange}
          className={styles.input}
          disabled={disabled}
          checked={checked}
          type="checkbox"
          id={`"${toggleId}"`}
        />
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label
          className={disabled
            ? classNames(styles.disabled, styles.toggleButton)
            : styles.toggleButton}
          htmlFor={`"${toggleId}"`}
        />
      </div>
    </div>
  );
};

Toggle.propTypes = {
  label: PropTypes.node.isRequired,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  title: PropTypes.node,
};
Toggle.defaultProps = {
  disabled: false,
  checked: false,
  title: null,
  onChange: null,
};

export default Toggle;
