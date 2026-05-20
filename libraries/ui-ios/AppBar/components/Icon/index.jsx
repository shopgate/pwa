import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()({
  root: {
    alignItems: 'center',
    color: 'inherit',
    display: 'flex',
    flexShrink: 0,
    fontSize: 24,
    height: 44,
    justifyContent: 'center',
    outline: 0,
    padding: 0,
    position: 'relative',
    width: 44,
    zIndex: 1,
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
    ...iconProps
  } = props;

  return (
    <div
      onKeyDown={onClick}
      tabIndex={0}
      role="button"
      aria-hidden={ariaHidden}
      aria-label={ariaLabel}
      className={classes.root}
      onClick={onClick}
      style={{
        background,
        color,
      }}
      data-test-id={testId}
    >
      <Icon key="icon" {...iconProps} />
      {Badge && <Badge key="badge" />}
    </div>
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
  'aria-hidden': false,
  'aria-label': null,
  background: 'inherit',
  badge: null,
  color: 'inherit',
  testId: null,
};

export default AppBarIcon;
