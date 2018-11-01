import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import Headline from 'Components/Headline';
import * as commonPortals from '@shopgate/pwa-common/constants/Portals';
import List from 'Components/List';

/**
 * Logged in user menu.
 * @param {function} logout Logout handler.
 * @returns {JSX}
 */
const LoggedIn = ({ logout }) => {
  const props = { Item: List.Item };
  return (
    <Fragment>
      <Portal name={commonPortals.NAV_MENU_MY_ACCOUNT_BEFORE} props={props} />
      <Portal name={commonPortals.NAV_MENU_MY_ACCOUNT} props={props}>
        <div data-test-id="userMenu">
          <Portal name={commonPortals.NAV_MENU_MY_ACCOUNT_HEADER} props={props}>
            <Headline small text="navigation.your_account" />
          </Portal>
          <List>
            <Portal name={commonPortals.NAV_MENU_LOGOUT_BEFORE} props={props} />
            <Portal name={commonPortals.NAV_MENU_LOGOUT} props={props}>
              <List.Item title="navigation.logout" onClick={logout} testId="logoutButton" />
            </Portal>
            <Portal name={commonPortals.NAV_MENU_LOGOUT_AFTER} props={props} />
          </List>
        </div>
      </Portal>
      <Portal name={commonPortals.NAV_MENU_MY_ACCOUNT_AFTER} props={props} />
    </Fragment>
  );
};

LoggedIn.propTypes = {
  logout: PropTypes.func.isRequired,
};

export default LoggedIn;
