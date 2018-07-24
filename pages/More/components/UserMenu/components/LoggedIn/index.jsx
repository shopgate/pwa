import React from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import * as commonPortals from '@shopgate/pwa-common/constants/Portals';
import List from 'Components/List';
import { USER_ADDRESSBOOK_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import appConfig from '@shopgate/pwa-common/helpers/config';

/**
 * Logged in user menu.
 * @param {function} logout Logout handler.
 * @returns {JSX}
 */
const LoggedIn = ({ logout }) => {
  const props = { Item: List.Item };
  return (
    <div data-test-id="userMenu">
      {
        (appConfig.featureFlag.user_addresses &&
        <List>
          <Portal name={commonPortals.NAV_MENU_MY_DETAILS_BEFORE} props={props} />
          <Portal name={commonPortals.NAV_MENU_MY_DETAILS} props={props}>
            <List.Item
              title="navigation.my_details"
              link="/user/details"
              testId="myDetailsButton"
            />
          </Portal>
          <Portal name={commonPortals.NAV_MENU_MY_DETAILS_AFTER} props={props} />

          <Portal name={commonPortals.NAV_MENU_CHANGE_PASSWORD_BEFORE} props={props} />
          <Portal name={commonPortals.NAV_MENU_CHANGE_PASSWORD} props={props}>
            <List.Item
              title="navigation.change_password"
              link="/user/password"
              testId="myChangePasswordButton"
            />
          </Portal>
          <Portal name={commonPortals.NAV_MENU_CHANGE_PASSWORD_AFTER} props={props} />

          <Portal name={commonPortals.NAV_MENU_ADDRESS_BOOK_BEFORE} props={props} />
          <Portal name={commonPortals.NAV_MENU_ADDRESS_BOOK} props={props}>
            <List.Item
              title="navigation.address_book"
              link={`${USER_ADDRESSBOOK_PATH}`}
              testId="addressBookButton"
            />
          </Portal>
          <Portal name={commonPortals.NAV_MENU_ADDRESS_BOOK_AFTER} props={props} />

          <Portal name={commonPortals.NAV_MENU_PAYMENT_OPTIONS_BEFORE} props={props} />
          <Portal name={commonPortals.NAV_MENU_PAYMENT_OPTIONS} props={props}>
            <List.Item
              title="navigation.payment_options"
              link="/user/paymentOptions"
              testId="paymentOptionsButton"
            />
          </Portal>
          <Portal name={commonPortals.NAV_MENU_PAYMENT_OPTIONS_AFTER} props={props} />

          <Portal name={commonPortals.NAV_MENU_LOGOUT_BEFORE} props={props} />
          <Portal name={commonPortals.NAV_MENU_LOGOUT} props={props}>
            <List.Item title="navigation.logout" onClick={logout} testId="logoutButton" />
          </Portal>
          <Portal name={commonPortals.NAV_MENU_LOGOUT_AFTER} props={props} />
        </List>

        ) ||
        <List>
          <Portal name={commonPortals.NAV_MENU_LOGOUT_BEFORE} props={props} />
          <Portal name={commonPortals.NAV_MENU_LOGOUT} props={props}>
            <List.Item title="navigation.logout" onClick={logout} testId="logoutButton" />
          </Portal>
          <Portal name={commonPortals.NAV_MENU_LOGOUT_AFTER} props={props} />
        </List>
      }
    </div>
  );
};

LoggedIn.propTypes = {
  logout: PropTypes.func.isRequired,
};

export default LoggedIn;
