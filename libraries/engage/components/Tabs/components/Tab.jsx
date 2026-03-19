import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { makeStyles, responsiveMediaQuery } from '@shopgate/engage/styles';
import Button from '@shopgate/pwa-ui-shared/Button';
import { ViewContext } from '../../View';

const useStyles = makeStyles()({
  root: {
    '&&': {
      maxWidth: 200,
      minWidth: 72,
      position: 'relative',
      boxSizing: 'border-box',
      minHeight: 48,
      flexShrink: 0,
      flexGrow: 1,
      padding: '6px 6px',
      overflow: 'hidden',
      whiteSpace: 'normal',
      textAlign: 'center',
    },
    [responsiveMediaQuery('<=xs', { appAlways: true })]: {
      flexShrink: 1,
      flexGrow: 1,
      flexBasis: 0,
      maxWidth: 'none',
    },
  },
  wrapper: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    flexDirection: 'column',
  },
});

/**
 * Tab component
 * @param {Object} props props
 * @returns {JSX}
 */
const Tab = (props) => {
  const { classes } = useStyles();
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
      className={classNames(classes.root, className)}
      role="tab"
      aria-selected={selected}
      disabled={disabled}
      onClick={handleClick}
      onFocus={handleFocus}
      tabIndex={selected ? 0 : -1}
    >
      <span className={classes.wrapper}>
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
