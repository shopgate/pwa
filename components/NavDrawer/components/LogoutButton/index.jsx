import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { onlyUpdateForKeys } from 'recompose';
import {
  NAV_MENU_LOGOUT,
  NAV_MENU_LOGOUT_AFTER,
  NAV_MENU_LOGOUT_BEFORE,
} from '@shopgate/pwa-common/constants/Portals';
import Portal from '@shopgate/pwa-common/components/Portal';
import LogoutIcon from '@shopgate/pwa-ui-shared/icons/LogoutIcon';
import { NavDrawer } from '@shopgate/pwa-ui-material';
import connect from './connector';

const enhance = onlyUpdateForKeys(['loggedIn']);

/**
 * @returns {JSX}
 */
const LogoutButton = ({ loggedIn, logout }) => (
  loggedIn && (
    <Fragment>
      <NavDrawer.Divider />
      <Portal name={NAV_MENU_LOGOUT_BEFORE} />
      <Portal name={NAV_MENU_LOGOUT}>
        <NavDrawer.Item
          label="navigation.logout"
          icon={LogoutIcon}
          onClick={logout}
          testId="navDrawerLogOutButton"
        />
      </Portal>
      <Portal name={NAV_MENU_LOGOUT_AFTER} />
    </Fragment>
  )
);

LogoutButton.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
};

export default connect(enhance(LogoutButton));
