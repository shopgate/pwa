import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '@shopgate/pwa-ui-shared/Button';
import { root, wrapper } from './Tab.style';

/**
 * Tab component
 * @param {Object} props props
 * @returns {JSX}
 */
const Tab = (props) => {
  const {
    classes,
    className,
    disabled = false,
    // eslint-disable-next-line react/prop-types
    fullWidth,
    icon,
    // eslint-disable-next-line react/prop-types
    indicator,
    label,
    onChange,
    onClick,
    onFocus,
    // eslint-disable-next-line react/prop-types
    selected,
    // eslint-disable-next-line react/prop-types
    selectionFollowsFocus,
    value,
    ...other
  } = props;

  /**
   * Handle Click
   * @param {Object} event event
   */
  const handleClick = (event) => {
    if (onChange) {
      onChange(event, value);
    }

    if (onClick) {
      onClick(event);
    }
  };

  /**
   * Handle Focus
   * @param {Object} event event
   */
  const handleFocus = (event) => {
    if (selectionFollowsFocus && !selected && onChange) {
      onChange(event, value);
    }

    if (onFocus) {
      onFocus(event);
    }
  };

  return (
    <Button
      flat
      type={selected ? 'secondary' : 'regular'}
      className={classNames(root, className)}
      role="tab"
      aria-selected={selected}
      disabled={disabled}
      onClick={handleClick}
      onFocus={handleFocus}
      tabIndex={selected ? 0 : -1}
      {...other}
    >
      <span className={wrapper}>
        {label}
      </span>
      {indicator}
    </Button>
  );
};

Tab.propTypes = {
  classes: PropTypes.shape().isRequired,
  className: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
  disableFocusRipple: PropTypes.bool.isRequired,
  disableRipple: PropTypes.bool.isRequired,
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]).isRequired,
  label: PropTypes.node.isRequired,
  onChange: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  value: PropTypes.shape().isRequired,
  wrapped: PropTypes.bool.isRequired,
};

export default Tab;
