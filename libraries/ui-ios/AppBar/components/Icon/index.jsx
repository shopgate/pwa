import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()(theme => ({
  root: {
    alignItems: 'center',
    color: 'inherit',
    display: 'flex',
    flexShrink: 0,
    fontSize: theme.components.icon.medium,
    height: 44,
    justifyContent: 'center',
    outline: 0,
    padding: 0,
    position: 'relative',
    width: 44,
    zIndex: 1,
    '&:focus-visible:not([data-silent-focus])': {
      outline: '2px solid currentColor',
      outlineOffset: -6,
      borderRadius: '50%',
    },
  },
}));

/**
 * The AppBarIcon component.
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
const AppBarIcon = (props) => {
  const { classes, cx } = useStyles();
  const {
    background,
    badge: Badge,
    className,
    color,
    icon: Icon,
    onClick,
    testId,
    'aria-hidden': ariaHidden,
    'aria-label': ariaLabel,
    ...rest
  } = props;
  const entries = Object.entries(rest);
  const dataAttributes = Object.fromEntries(entries.filter(([name]) => name.startsWith('data-')));
  const iconProps = Object.fromEntries(entries.filter(([name]) => !name.startsWith('data-')));

  /**
   * @param {KeyboardEvent} event The key event.
   */
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick(event);
    }
  };

  return (
    <div
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-hidden={ariaHidden}
      aria-label={ariaLabel}
      className={cx(classes.root, 'ui-ios__app-bar__icon', className)}
      onClick={onClick}
      style={{
        background,
        color,
      }}
      data-test-id={testId}
      {...dataAttributes}
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
  className: PropTypes.string,
  color: PropTypes.string,
  testId: PropTypes.string,
};

AppBarIcon.defaultProps = {
  'aria-hidden': false,
  'aria-label': null,
  background: 'inherit',
  badge: null,
  className: null,
  color: 'inherit',
  testId: null,
};

export default AppBarIcon;
