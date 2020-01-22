import React, { memo } from 'react';
import PropTypes from 'prop-types';
import {
  NAV_MENU_LOGOUT,
  NAV_MENU_LOGOUT_AFTER,
  NAV_MENU_LOGOUT_BEFORE,
} from '@shopgate/pwa-common/constants/Portals';
import Portal from '@shopgate/pwa-common/components/Portal';
import LogoutIcon from '@shopgate/pwa-ui-shared/icons/LogoutIcon';
import { NavDrawer } from '@shopgate/pwa-ui-material';
import connect from './connector';
import portalProps from '../../portalProps';

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

export default connect(memo(LogoutButton));
