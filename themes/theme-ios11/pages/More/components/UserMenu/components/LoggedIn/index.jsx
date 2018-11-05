import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import Headline from 'Components/Headline';
import * as commonPortals from '@shopgate/pwa-common/constants/Portals';
import Item from '../../../Item';
import pageStyles from '../../../../style';

/**
 * @param {Object} props The component props.
 * @param {Object} context The consumed context.
 * @returns {JSX}
 */
const LoggedIn = ({ logout }, context) => {
  const { __ } = context.i18n();
  const props = { Item };
  return (
    <Fragment>
      <Portal name={commonPortals.NAV_MENU_MY_ACCOUNT_BEFORE} props={props} />
      <Portal name={commonPortals.NAV_MENU_MY_ACCOUNT} props={props}>
        <div data-test-id="userMenu">
          <Portal name={commonPortals.NAV_MENU_MY_ACCOUNT_HEADER} props={props}>
            <Headline small text={__('navigation.your_account')} style={pageStyles.headline} />
          </Portal>
          <nav className={pageStyles.list}>
            <Portal name={commonPortals.NAV_MENU_LOGOUT_BEFORE} props={props} />
            <Portal name={commonPortals.NAV_MENU_LOGOUT} props={props}>
              <Item onClick={logout} label="navigation.logout" testId="logoutButton" />
            </Portal>
            <Portal name={commonPortals.NAV_MENU_LOGOUT_AFTER} props={props} />
          </nav>
        </div>
      </Portal>
      <Portal name={commonPortals.NAV_MENU_MY_ACCOUNT_AFTER} props={props} />
    </Fragment>
  );
};

LoggedIn.propTypes = {
  logout: PropTypes.func.isRequired,
};

LoggedIn.contextTypes = {
  i18n: PropTypes.func,
};

export default LoggedIn;
