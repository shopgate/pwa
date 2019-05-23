import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Portal } from '@shopgate/engage/components';
import * as portals from '@shopgate/engage/core';
import LoggedIn from './components/LoggedIn';
import LoggedOut from './components/LoggedOut';

/**
 * User menu component.
 * Renders log out button when user is logged in or log in / register when user is logged out.
 *
 * @param {Object} props Props.
 * @param {boolean} props.isLoggedIn User is logged in.
 * @param {Function} props.logout Logout function.
 * @param {Object|null} props.user User info.
 * @param {Object|null} props.entries More menu entries (for extensions).
 * @returns {XML}
 */
const UserMenu = ({
  isLoggedIn,
  logout,
  user,
  entries,
}) => {
  const portalProps = {
    handleLogout: logout, // Backwards compat?
    isLoggedIn,
    logout,
    user,
    entries,
  };

  return (
    <Fragment>
      <Portal name={portals.USER_MENU_CONTAINER_BEFORE} props={portalProps} />
      <Portal name={portals.USER_MENU_CONTAINER} props={portalProps}>
        { isLoggedIn && <LoggedIn logout={logout} />}
        { !isLoggedIn && <LoggedOut />}
      </Portal>
      <Portal name={portals.USER_MENU_CONTAINER_AFTER} props={portalProps} />
    </Fragment>
  );
};

UserMenu.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
  entries: PropTypes.shape(),
  user: PropTypes.shape(),
};

UserMenu.defaultProps = {
  entries: null,
  user: null,
};

export default UserMenu;
