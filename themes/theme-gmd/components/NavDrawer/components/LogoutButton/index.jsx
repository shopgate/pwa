import React from 'react';
import PropTypes from 'prop-types';
import { onlyUpdateForKeys } from 'recompose';
import {
  NAV_MENU_LOGOUT,
  NAV_MENU_LOGOUT_AFTER,
  NAV_MENU_LOGOUT_BEFORE,
} from '@shopgate/engage/core';
import { Portal, NavDrawer } from '@shopgate/engage/components';
import LogoutIcon from '@shopgate/pwa-ui-shared/icons/LogoutIcon';
import connect from './connector';
import portalProps from '../../portalProps';

const enhance = onlyUpdateForKeys(['loggedIn']);

/**
 * @returns {JSX}
 */
const LogoutButton = ({ loggedIn, logout }) => (
  loggedIn && (
    <NavDrawer.Section>
      <Portal name={NAV_MENU_LOGOUT_BEFORE} props={portalProps} />
      <Portal name={NAV_MENU_LOGOUT} props={portalProps}>
        <NavDrawer.Item
          label="navigation.logout"
          icon={LogoutIcon}
          onClick={logout}
          testId="navDrawerLogOutButton"
        />
      </Portal>
      <Portal name={NAV_MENU_LOGOUT_AFTER} props={portalProps} />
    </NavDrawer.Section>
  )
);

LogoutButton.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
};

export default connect(enhance(LogoutButton));
