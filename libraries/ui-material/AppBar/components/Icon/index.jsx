import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()({
  root: {
    color: 'inherit',
    display: 'flex',
    flexShrink: 0,
    fontSize: 24,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    outline: 0,
    padding: 0,
    position: 'relative',
    width: 56,
  },
});

/**
 * The AppBarIcon component.
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
const AppBarIcon = (props) => {
  const { classes } = useStyles();
  const {
    background,
    badge: Badge,
    color,
    icon: Icon,
    onClick,
    testId,
    'aria-hidden': ariaHidden,
    'aria-label': ariaLabel,
  } = props;

  return (
    <button
      className={classes.root}
      onClick={onClick}
      style={{
        background,
        color,
      }}
      data-test-id={testId}
      aria-hidden={ariaHidden}
      aria-label={ariaLabel}
      type="button"
    >
      <Icon />
      {Badge && <Badge />}
    </button>
  );
};

AppBarIcon.propTypes = {
  icon: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  'aria-hidden': PropTypes.bool,
  'aria-label': PropTypes.string,
  background: PropTypes.string,
  badge: PropTypes.func,
  color: PropTypes.string,
  testId: PropTypes.string,
};

AppBarIcon.defaultProps = {
  'aria-hidden': null,
  'aria-label': null,
  background: 'inherit',
  badge: null,
  color: 'inherit',
  testId: null,
};

export default AppBarIcon;
