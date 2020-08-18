import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import * as commonPortals from '@shopgate/pwa-common/constants/Portals';
import { ORDERS_PATH, WISH_LIST_PATH, PROFILE_PATH } from '@shopgate/engage/account';
import Section from '../../../Section';
import Item from '../../../Item';

/**
 * @param {Object} props The component props.
 * @param {Object} context The consumed context.
 * @returns {JSX}
 */
const LoggedIn = ({ logout }) => {
  const props = { Item };
  return (
    <Fragment>
      <Portal name={commonPortals.NAV_MENU_MY_ACCOUNT_BEFORE} props={props} />
      <Portal name={commonPortals.NAV_MENU_MY_ACCOUNT} props={props}>
        <div data-test-id="userMenu">
          <Section title="navigation.your_account">
            <Item
              href={PROFILE_PATH}
              label="navigation.profile"
              testId="accountButton"
            />
            <Item
              href={ORDERS_PATH}
              label="navigation.order_history"
              testId="accountButton"
            />
            <Item
              href={WISH_LIST_PATH}
              label="navigation.wish_list"
              testId="accountButton"
            />
            <Portal name={commonPortals.NAV_MENU_LOGOUT_BEFORE} props={props} />
            <Portal name={commonPortals.NAV_MENU_LOGOUT} props={props}>
              <Item
                onClick={logout}
                label="navigation.logout"
                testId="logoutButton"
              />
            </Portal>
            <Portal name={commonPortals.NAV_MENU_LOGOUT_AFTER} props={props} />
          </Section>
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
