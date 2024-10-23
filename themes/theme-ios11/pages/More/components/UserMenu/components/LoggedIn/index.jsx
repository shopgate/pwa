import React from 'react';
import PropTypes from 'prop-types';
import { hasNewServices } from '@shopgate/engage/core/helpers';
import { NAV_MENU_MY_ACCOUNT, NAV_MENU_LOGOUT } from '@shopgate/engage/core/constants';
import { SurroundPortals } from '@shopgate/engage/components';
import { ORDERS_PATH, WISH_LIST_PATH, PROFILE_PATH } from '@shopgate/engage/account/constants';
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
    <SurroundPortals portalName={NAV_MENU_MY_ACCOUNT} portalProps={props}>
      <div data-test-id="userMenu">
        <Section title="navigation.your_account">
          {hasNewServices() && (
            <>
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
                label="navigation.favorites"
                testId="accountButton"
              />
            </>
          )}
          <SurroundPortals portalName={NAV_MENU_LOGOUT} portalProps={props}>
            <Item
              onClick={logout}
              label="navigation.logout"
              testId="logoutButton"
            />
          </SurroundPortals>
        </Section>
      </div>
    </SurroundPortals>
  );
};

LoggedIn.propTypes = {
  logout: PropTypes.func.isRequired,
};

export default LoggedIn;
