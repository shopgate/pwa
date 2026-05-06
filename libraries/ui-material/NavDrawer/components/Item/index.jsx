import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { UIEvents } from '@shopgate/pwa-core';
import { withForwardedRef } from '@shopgate/engage/core';
import { I18n } from '@shopgate/engage/components';
import { themeColors } from '@shopgate/pwa-common/helpers/config';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()({
  srOnly: {
    clip: 'rect(1px, 1px, 1px, 1px)',
    height: '1px',
    margin: 0,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    whiteSpace: 'nowrap',
    width: '1px',
    zIndex: -1000,
    '&:first-of-type': {
      marginTop: 'calc(16px + var(--safe-area-inset-top))',
    },
  },
  button: {
    alignItems: 'flex-start',
    color: 'inherit',
    display: 'flex',
    fontWeight: 500,
    outline: 0,
    padding: '16px 8px 16px 0',
    position: 'relative',
    width: '100%',
    '&:first-of-type': {
      paddingTop: 'calc(16px + var(--safe-area-inset-top))',
    },
  },
  label: {
    marginTop: 2,
    textAlign: 'left',
  },
  iconWrapper: {
    width: 56,
    flexShrink: 0,
  },
  icon: {
    boxSizing: 'content-box',
    color: themeColors.gray,
    padding: '0 32px 0 16px',
  },
});

/**
 * The NavDrawerItem component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const NavDrawerItem = ({
  'aria-hidden': ariaHidden,
  'aria-label': ariaLabel,
  badge: Badge,
  forwardedRef,
  icon: Icon,
  label,
  srOnly,
  style,
  testId,
  onClick,
}) => {
  const { classes } = useStyles();

  /**
   * Handles the click event for the NavDrawerItem component.
   */
  const handleClick = () => {
    UIEvents.emit('navdrawer_close');
    setTimeout(onClick, 300);
  };

  return (
    <button
      ref={forwardedRef}
      className={srOnly ? classes.srOnly : classes.button}
      data-test-id={testId}
      onClick={handleClick}
      style={style}
      type="button"
      aria-hidden={ariaHidden}
      aria-label={ariaLabel}
      tabIndex="0"
    >
      <div className={classes.iconWrapper}>
        {Icon && <Icon className={classes.icon} size={24} />}
      </div>
      <I18n.Text className={classes.label} string={label} />
      {Badge && <Badge />}
    </button>
  );
};

NavDrawerItem.propTypes = {
  label: PropTypes.string.isRequired,
  'aria-hidden': PropTypes.bool,
  'aria-label': PropTypes.string,
  badge: PropTypes.elementType,
  forwardedRef: PropTypes.shape(),
  icon: PropTypes.func,
  onClick: PropTypes.func,
  srOnly: PropTypes.bool,
  style: PropTypes.shape(),
  testId: PropTypes.string,
};

NavDrawerItem.defaultProps = {
  'aria-hidden': null,
  'aria-label': null,
  badge: null,
  forwardedRef: null,
  icon: null,
  onClick: () => { },
  srOnly: false,
  style: {},
  testId: null,
};

export default withForwardedRef(memo(NavDrawerItem));
