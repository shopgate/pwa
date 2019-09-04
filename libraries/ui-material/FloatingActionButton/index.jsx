import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import colors from '../colors';
import styles from './style';

const SIZE_BIG = 'big';
const SIZE_SMALL = 'small';

const TYPE_BUTTON = 'button';
const TYPE_SUBMIT = 'submit';

/**
 * The FloatingActionButton component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const FloatingActionButton = (props) => {
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
  } = props;

  const classes = classNames(
    styles.button,
    {
      [className]: className,
      [styles.buttonSmall]: size === SIZE_SMALL,
      [styles.buttonSmall]: size === SIZE_SMALL,
      [styles.buttonLarge]: size === SIZE_BIG,
      [styles.buttonShadow]: raised,
    }
  );

  return (
    // eslint-disable-next-line react/button-has-type
    <button
      className={classes}
      disabled={disabled}
      onClick={onClick}
      ref={ref}
      style={{ background }}
      type={type}
      data-test-id={props.testId}
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
  background: colors.primary,
  className: null,
  disabled: false,
  onClick: () => {},
  raised: true,
  ref: null,
  size: SIZE_BIG,
  testId: null,
  type: 'button',
};

export default FloatingActionButton;
