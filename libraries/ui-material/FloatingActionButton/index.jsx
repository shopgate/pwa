import React from 'react';
import PropTypes from 'prop-types';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { makeStyles } from '@shopgate/engage/styles';

const SIZE_BIG = 'big';
const SIZE_SMALL = 'small';

const TYPE_BUTTON = 'button';
const TYPE_SUBMIT = 'submit';

const useStyles = makeStyles()({
  button: {
    borderRadius: '50%',
    outline: 0,
    overflow: 'hidden',
    padding: 0,
    position: 'relative',
    zIndex: 1,
    ':disabled': {
      cursor: 'not-allowed',
    },
  },
  buttonSmall: {
    height: 40,
    width: 40,
  },
  buttonLarge: {
    height: 56,
    width: 56,
  },
  buttonShadow: {
    boxShadow: themeConfig.shadows.buttons.elevated,
  },
});

/**
 * The FloatingActionButton component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const FloatingActionButton = (props) => {
  const { classes, cx } = useStyles();
  const {
    background,
    children,
    className,
    disabled,
    onClick,
    raised,
    ref,
    size,
    type,
    testId,
  } = props;

  const rootClass = cx(
    'floating-action-button',
    'ui-material__floating-action-button',
    classes.button,
    {
      [className]: className,
      [classes.buttonSmall]: size === SIZE_SMALL,
      [classes.buttonLarge]: size === SIZE_BIG,
      [classes.buttonShadow]: raised,
    }
  );

  return (
    <button
      className={rootClass}
      disabled={disabled}
      onClick={onClick}
      ref={ref}
      style={{ background }}
      // eslint-disable-next-line react/button-has-type
      type={type}
      data-test-id={testId}
    >
      {children}
    </button>
  );
};

FloatingActionButton.propTypes = {
  children: PropTypes.node.isRequired,
  background: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  raised: PropTypes.bool,
  ref: PropTypes.node,
  size: PropTypes.oneOf([SIZE_BIG, SIZE_SMALL]),
  testId: PropTypes.string,
  type: PropTypes.oneOf([TYPE_BUTTON, TYPE_SUBMIT]),
};

FloatingActionButton.defaultProps = {
  background: 'var(--color-primary)',
  className: null,
  disabled: false,
  onClick: () => { },
  raised: true,
  ref: null,
  size: SIZE_BIG,
  testId: null,
  type: 'button',
};

export default FloatingActionButton;
