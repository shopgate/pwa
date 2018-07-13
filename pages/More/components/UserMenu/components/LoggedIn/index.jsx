import React from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import * as commonPortals from '@shopgate/pwa-common/constants/Portals';
import List from 'Components/List';

/**
 * Logged in user menu.
 * @param {function} logout Logout handler.
 * @returns {JSX}
 */
const LoggedIn = ({ logout }) => (
  <div data-test-id="userMenu">
    <List>
      <Portal name={commonPortals.NAV_MENU_LOGOUT_BEFORE} props={{ Item: List.Item }} />
      <Portal name={commonPortals.NAV_MENU_LOGOUT}>
        <List.Item title="navigation.logout" onClick={logout} testId="logoutButton" />
      </Portal>
      <Portal name={commonPortals.NAV_MENU_LOGOUT_AFTER} props={{ Item: List.Item }} />
    </List>
  </div>
);

LoggedIn.propTypes = {
  logout: PropTypes.func.isRequired,
};

export default LoggedIn;
