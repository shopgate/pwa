import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import { VisuallyHidden } from '@shopgate/engage/a11y/components';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const useStyles = makeStyles()({
  container: {
    display: 'flex',
    flex: 1,
    textAlign: 'left',
    justifyContent: 'space-between',
    flexDirection: 'row-reverse',
    gap: '32px',
  },
  input: {
    display: 'flex',
    flexShrink: 0,
    appearance: 'none',
    width: '40px',
    height: '20px',
    backgroundColor: '#ccc',
    borderRadius: '10px',
    position: 'relative',
    cursor: 'pointer',

    ':before': {
      content: '""',
      position: 'absolute',
      top: '2px',
      left: '2px',
      width: '16px',
      height: '16px',
      backgroundColor: 'white',
      borderRadius: '50%',
      transition: 'transform 0.3s',
    },
    ':checked': {
      backgroundColor: 'var(--color-secondary)',
    },
    ':checked::before': {
      transform: 'translateX(20px)',
    },
    ':disabled': {
      backgroundColor: themeConfig.colors.shade7,
      cursor: 'not-allowed',
    },
  },
});

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
  const { classes } = useStyles();
  const switchId = useMemo(() => id || Math.random(), [id]);

  return (
    <div className={classes.container}>
      <input
        type="checkbox"
        disabled={disabled}
        checked={checked}
        onChange={onChange}
        className={classes.input}
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
