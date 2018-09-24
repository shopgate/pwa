import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import * as portals from '@shopgate/pwa-common/constants/Portals';
import LoggedIn from './components/LoggedIn';
import LoggedOut from './components/LoggedOut';

/**
 * User menu component.
 * Renders log out button when user is logged in or log in / register when user is logged out.
 *
 * @param {Object} props Props.
 * @param {boolean} props.isLoggedIn User is logged in.
 * @param {function} props.logout Logout function.
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
      { /* When user is logged in this menu is shown on the bottom */}
      {/* USER MENU */}
      <Portal
        name={portals.USER_MENU_CONTAINER_BEFORE}
        props={portalProps}
      />
      <Portal
        name={portals.USER_MENU_CONTAINER}
        props={portalProps}
      >
        { isLoggedIn && <LoggedIn logout={logout} />}
        { !isLoggedIn && <LoggedOut />}
      </Portal>
      <Portal
        name={portals.USER_MENU_CONTAINER_AFTER}
        props={portalProps}
      />
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
