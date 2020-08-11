import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '@shopgate/pwa-ui-shared/Button';
import { root, wrapper } from './Tab.style';
import { ViewContext } from '../../View';

/**
 * Tab component
 * @param {Object} props props
 * @returns {JSX}
 */
const Tab = (props) => {
  const {
    className,
    disabled = false,
    // eslint-disable-next-line react/prop-types
    indicator,
    label,
    onChange,
    onFocus,
    // eslint-disable-next-line react/prop-types
    selected,
    value,
  } = props;

  const { contentRef } = useContext(ViewContext);

  /**
   * Handle Click
   * @param {Object} event event
   */
  const handleClick = (event) => {
    if (onChange) {
      onChange(event, value);
      contentRef.current.scrollTop = 0;
    }
  };

  /**
   * Handle Focus
   * @param {Object} event event
   */
  const handleFocus = (event) => {
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
    >
      <span className={wrapper}>
        {label}
      </span>
      {indicator}
    </Button>
  );
};

Tab.propTypes = {
  label: PropTypes.node.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

Tab.defaultProps = {
  className: null,
  value: null,
  disabled: false,
  onChange: null,
  onFocus: null,
};

export default Tab;
