import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, cx } from '@shopgate/engage/styles';
import IndicatorCircle from '../IndicatorCircle';
import RippleButton from '../RippleButton';

const useStyles = makeStyles()(theme => ({
  withGap: {
    textAlign: 'center',
    margin: theme.spacing(1, 0),
  },
  noGap: {
    textAlign: 'center',
  },
  containerCircle: {
    textAlign: 'center',
    margin: `${theme.spacing(1) + 5}px 0`,
  },
}));

const CLICK_DELAY = 300;

/**
 * The action button component.
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
const ActionButton = ({
  children,
  className,
  disabled,
  flat,
  type,
  onClick,
  disableClickDelay,
  loading,
  noGap,
  testId,
  ...rest
}) => {
  const { classes } = useStyles();

  const handleClick = useCallback((event) => {
    if (disableClickDelay) {
      onClick(event);
      return;
    }
    setTimeout(() => {
      onClick(event);
    }, CLICK_DELAY);
  }, [disableClickDelay, onClick]);

  const buttonProps = {
    className,
    disabled,
    flat,
    type,
  };

  if (loading) {
    return (
      <div className={classes.containerCircle}>
        <IndicatorCircle />
      </div>
    );
  }

  const containerClass = noGap ? classes.noGap : classes.withGap;

  return (
    <div
      className={cx('ui-shared__action-button', containerClass)}
      data-test-id={testId}
    >
      <RippleButton
        {...rest}
        {...buttonProps}
        onClick={handleClick}
      >
        {children}
      </RippleButton>
    </div>
  );
};

ActionButton.propTypes = {
  ...RippleButton.propTypes,
  onClick: PropTypes.func.isRequired,
  disableClickDelay: PropTypes.bool,
  loading: PropTypes.bool,
  noGap: PropTypes.bool,
  testId: PropTypes.string,
};

ActionButton.defaultProps = {
  ...RippleButton.defaultProps,
  loading: false,
  type: 'primary',
  flat: true,
  noGap: false,
  testId: null,
  disableClickDelay: false,
};

ActionButton.clickDelay = CLICK_DELAY;

export default ActionButton;
