import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { VisuallyHidden } from '@shopgate/engage/a11y/components';
import styles from './style';

/**
 * The Switch component.
 * @param {Object} props The component props.
 * @param {React.ReactNode} [children=null] Component children are rendered as the checkbox label
 * @param {boolean} [props.checked=false] Whether the checkbox is checked
 * @param {boolean} [props.disabled=false] Whether the checkbox is disabled
 * @param {Function} [props.onChange] Callback invoked when the checkbox changes
 * @param {string} [props.a11yFallbackText=null] Optional text to be presented to screen readers
 * when issues with the regular label are expected e.g. due to problematic layout.
 * @param {string} [props.id=null] Optional custom id for checkbox input and label
 * @returns {JSX.Element}
 */
const Switch = ({
  disabled,
  checked,
  onChange,
  id,
  a11yFallbackText,
  children,
}) => {
  const switchId = useMemo(() => id || Math.random(), [id]);

  return (
    <div className={styles.container}>
      <input
        type="checkbox"
        disabled={disabled}
        checked={checked}
        onChange={onChange}
        className={styles.input}
        id={switchId}
      />

      { children && (
        <label htmlFor={switchId}>
          <span aria-hidden={!!a11yFallbackText}>
            {children}
          </span>
          { a11yFallbackText && (
          <VisuallyHidden>
            { a11yFallbackText}
          </VisuallyHidden>
          )}
        </label>
      )}
    </div>
  );
};

Switch.propTypes = {
  a11yFallbackText: PropTypes.string,
  checked: PropTypes.bool,
  children: PropTypes.node,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  onChange: PropTypes.func,
};
Switch.defaultProps = {
  children: null,
  disabled: false,
  a11yFallbackText: null,
  checked: false,
  onChange: null,
  id: null,
};

export default Switch;
